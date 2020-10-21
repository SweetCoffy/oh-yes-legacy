const CommandError = require("../CommandError");
const stuff = require("../stuff");

module.exports = {
    name: "get-user",
    description: "gets a user's data, command intended for debugging",
    usage: "get-user <user:mention|userid>",
    requiredPermission: "commands.get-user",
    execute(message, args) {
        var user = (message.mentions.users.first() || {}).id || args[0]
        if (!user) throw CommandError.undefinedError;
        var entries = Object.entries(stuff.db.getData(`/${user}/`));
        var generated = entries.filter(el => typeof el[1] != 'object').map(el => `(\`${el[0]}\`) ${stuff.thing(el[0])}: **${el[1]}**`)
        var embed = {
            title: `${message.client.users.cache.get(user).username}'s data`,
            description: generated.join("\n")
        }
        message.channel.send({embed: embed});
    }
}
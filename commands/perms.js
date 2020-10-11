const stuff = require("../stuff");

module.exports = {
    name: "perms",
    description: "shows your permissions lol",
    usage: "perms [user]",
    execute(message, args) {
        var user = message.mentions.users.first() || message.author;
        var entries = Object.entries(stuff.db.getData(`/${user.id}/permissions`));
        var permissionNames = [];
        entries.forEach(el => {
            permissionNames.push(`\`${stuff.getPermission(user.id, el[0]) ? "✅" : "❌"}\` **${el[0]}**`)
        })
        var embed = {
            title: `${user.username}'s permissions`,
            description: permissionNames.join("\n")
        }
        message.channel.send({embed: embed})
    }
}
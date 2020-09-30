const stuff = require('../stuff');
module.exports = {
    name: "get",
    description: "returns the value of a setting",
    usage: "get <setting:string>",

    execute (message, args) {
        var value = stuff.getConfig(args[0]);
        var embed = {
            description: `\`${args[0]}\`: \`${value}\``
        }

        message.channel.send({embed: embed});
    }
}
const stuff = require('../stuff')

module.exports = {
    name: "set",
    requiredPermission: "commands.set",
    description: "sets a config value",
    usableAnywhere: true,
    usableAnytime: true,
    arguments: [
        {
            name: "setting",
            type: "string"
        },
        {
            name: "value",
            type: "any"
        }
    ],
    useArgsObject: true,
    execute (message, args) {
        stuff.set(args.setting, args.value);    
        var embed = {
            title: `set \`${args.setting}\` to \`${args.value}\``,
        }
        message.channel.send({embed: embed});
    }
}


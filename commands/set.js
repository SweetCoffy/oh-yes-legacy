const stuff = require('../stuff')

module.exports = {
    name: "set",
    requiredPermission: "commands.set",
    description: "sets a config value",
    usableAnywhere: true,
    usableAnytime: true,
    supportsQuoteArgs: true,
    arguments: [
        {
            name: "setting",
            type: "string"
        },
        {
            name: "value",
            type: "any"
        },
        {
            name: "forceString",
            type: "bool"
        }
    ],
    useArgsObject: true,
    execute (message, args) {
        var v = args.value
        if (args.forceString) v = args._value;
        stuff.set(args.setting, v);    
        var embed = {
            title: `set \`${args.setting}\` to \`${v}\``,
        }
        message.channel.send({embed: embed});
    }
}


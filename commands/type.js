const stuff = require("../stuff")

module.exports = {
    name: 'type',
    description: "Shows a list of all available command argument types",
    arguments: [
        {
            name: "type",
            type: 'string',
            optional: true,
            default: 'all',
            description: 'The type to show info about'
        }
    ],
    useArgsObject: true,
    execute(message, args) {
        if (args.type == 'all') {
            var embed = {
                color: 0x4287f5,
                title: 'Type list',
                description: Object.keys(stuff.conversions).map(el => `\`${el}\``).join(', ')
            }
            message.channel.send({embed: embed})
        } else {
            var type = stuff.conversions[args.type]
            if (type == undefined) throw `Type \`${args.type}\` doesn't exist`
            var embed = {
                color: 0x4287f5,
                title: args.type,
                description: `\`\`\`js\n${type}\n\`\`\``
            }
            message.channel.send({embed: embed})
        }
    }
}
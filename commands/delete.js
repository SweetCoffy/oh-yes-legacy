var stuff = require('../stuff')
module.exports = {
    name: "delete",
    requiredPermission: "commands.delete",
    useArgsObject: true,
    arguments: [
        {
            name: "setting",
            type: "string",
        }
    ],
    execute(message, args) {
        if (stuff.removeSetting(args.setting)) {
            message.channel.send(`Setting \`${args.setting}\` removed succesfully`)
        } else {
            throw `Could not remove setting \`${args.setting}\``
        }
    }
}
const stuff = require("../../stuff")

module.exports = {
    name: "set",
    useArgsObject: true,
    requiredPermission: "commands.stuff.set",
    arguments: [
        {
            name: "file",
            type: "string",
            description: "The file to enable/disable"
        },
        {
            name: "enabled",
            type: "bool",
            description: "Whether or not to enable the file"
        }
    ],
    onExecute(message, args) {
        var c = stuff.loadedContent[args.file]
        if (!c) throw `Could not find a file called \`${args.file}\``
        c.enabled = args.enabled
        stuff.updateContent()
        message.channel.send(`${c.type[0].toUpperCase() + c.type.slice(1)} ${c.id} is now ${c.enabled ? "enabled" : "disabled"}`)
    }
}
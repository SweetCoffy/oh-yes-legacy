const stuff = require("../stuff")

module.exports = {
    name: "send",
    useArgsObject: true,
    requiredPermission: "commands.send",
    arguments: [
        {
            name: "thing",
            type: "string"
        }
    ],
    execute(message, args) {
        var c = stuff.spawnStuff[stuff.curId]
        if (c) {
            c.send(args.thing, (er) => {
                if (er) console.log(er)
                else message.channnel.send("yes")
            })
        }
    }
}
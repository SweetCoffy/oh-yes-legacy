const stuff = require("../../stuff")

module.exports = {
    name: "info",
    useArgsObject: true,
    arguments: [
        {
            name: "cheat",
            type: "string"
        }
    ],
    onExecute(message, args) {
        var embed = {
            title: stuff.cheats[args.cheat]?.name || "???",
            description: stuff.cheats[args.cheat]?.description || "???",
        }
        message.channel.send({embed: embed})
    }
}
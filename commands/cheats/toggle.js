var stuff = require('../../stuff')
module.exports = {
    name: "toggle",
    useArgsObject: true,
    arguments: [{ name: "cheat", type: "string" }],
    onExecute(message, args) {
        var h = stuff.setCheat(message.author.id, args.cheat)
        message.channel.send(`${stuff.cheats[args.cheat].name || "???"} is now ${h ? "enabled" : "disabled"}`)
    }
}

const stuff = require("../stuff")

module.exports = {
    name: "whothefuckisntready",
    description: "Shows who isn't ready in the pvp match",
    aliases: ["whothefuckdidntchoose", "isntready", "notready", "didntchose"],
    execute(msg) {
        var match = stuff.pvp[msg.author.id]
        if (!match) throw "bruv"
        msg.channel.send(`Fucking eggers who aren't ready:\n${match.users.filter(el => !(match.choices.some(ch => ch.user.id == el.id))).map(el => el.username).join("\n")}`)
    }
}
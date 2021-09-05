var stuff = require('../../stuff')
module.exports = {
    name: "list",
    onExecute(message) {
        var unlocked = Object.entries(stuff.getUnlockedCheats(message.author.id)).filter(el => el[1])
        var enabled = Object.entries(stuff.getCheats(message.author.id)).filter(el => el[1])
        var embed = {
            title: "Cheats lol",
            fields: [
                {
                    name: "Enabled",
                    value: enabled.map(el => `${stuff.cheats[el[0]]?.name || "???"}`).join(", ") || "<none>"
                },
                {
                    name: "Unlocked",
                    value: unlocked.map(el => `${stuff.cheats[el[0]]?.name || "???"} \`${el[0]}\``).join("\n") || "<none>"
                },
            ]
        }
        message.channel.send({embed: embed})
    }
}
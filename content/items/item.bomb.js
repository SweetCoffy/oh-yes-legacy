const stuff = require("../../stuff")

module.exports = {
    name: "Bomb",
    icon: "💣",
    unlisted: true,
    rarity: stuff.rarity.yellow,
    description: "bobm",
    onUse(user, msg) {
        stuff.removeItem(user, "bomb")
        msg.channel.send('💣').then(m => {
            setTimeout(() => {
                m.edit("💥").then(() => {
                    for (var k in stuff.userHealth) {
                        if (stuff.userHealth[k] <= 1) {
                            stuff.userHealth[k] = 0
                            continue
                        }
                        stuff.userHealth[k] = 1
                    }
                    for (var k in stuff.fighting) {
                        if (!stuff.fighting[k]) continue;
                        if (stuff.fighting[k].health <= 1) {
                            stuff.fighting[k].health = 0
                            continue
                        }
                        console.log(stuff.fighting[k])
                        stuff.fighting[k].health = 1;
                    }
                })
            }, 5000)
        })
        throw ''
    }
}
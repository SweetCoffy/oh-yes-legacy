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
                        for (var e of stuff.fighting[k].enemies) {
                            if (e.health <= 1) e.health = 0;
                            else e.health = 1;
                        }
                    }
                })
            }, 5000)
        })
        throw ''
    }
}
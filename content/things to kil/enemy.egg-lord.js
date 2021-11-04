const stuff = require("../../stuff")

module.exports = {
    name: "Egg Lord",
    id: "egg-lord",
    description: "An angry egg fan who turned into egg lord because somebody ate an egg",
    minHealth: 5000,
    maxHealth: 5000,
    minDefense: 90,
    maxDefense: 90,
    minAttack: 100,
    maxAttack: 100,
    moneyDrop: 10000,
    hidden: true,
    drugTransform: "undercocked-egg-lord-prime",
    xpReward: 1254,
    boss: true,
    rarity: 999,
    ai(self, player, e) {
        if (e.enemies.length < 10) {
            if (Math.random() < 0.4) {
                e.enemies.push(stuff.createEnemy(stuff.enemies["egg-hater"]))
                e.logs.push(`${self.name} Summoned an Egg Hater!`)
            }
        }
    },
    drops: [
        { min: 1, max: 2, item: "ice-cube", chance: 0.5 },
        { min: 15, max: 50, item: "voidv_", chance: 0.75 },
        { item: "stat-changer", chance: 0.5, min: 2, max: 7 }
    ]
}
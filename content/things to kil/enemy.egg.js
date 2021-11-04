const stuff = require("../../stuff")

module.exports = {
    name: "Egg",
    id: "egg",
    description: "Egg",
    minHealth: 1,
    maxHealth: 1,
    minDefense: 0,
    maxDefense: 0.01,
    minAttack: 0,
    maxAttack: 0.0001,
    rarity: 10,
    moneyDrop: 5,
    hidden: false,
    xpReward: 5,
    onEnd: (e) => {
        if (Math.random() < 0.95) {
            stuff.startBattle(e.user, stuff.enemies["egg-lord"])
        } else stuff.startBattle(e.user, stuff.enemies["egg-lord-prime"])
    },
    onKillOther(e, self, p) {
        stuff.addAchievement(e.user.id, {
            id: "hunt:really",
            name: "REALLY????",
            description: "Did you really just fucking get killed by a fucking egg?",
            rarity: stuff.rarity.yellow,
        })
        stuff.addItem(e.user.id, "u")
    }
}
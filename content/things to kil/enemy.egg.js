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
    moneyDrop: 5,
    hidden: false,
    xpReward: 5,
    onKill: (m, u) => {
        if (Math.random() < 0.95) {
            stuff.startBattle(u.id, stuff.enemies["egg-lord"])
        } else stuff.startBattle(u.id, stuff.enemies["egg-lord-prime"])
    }
}
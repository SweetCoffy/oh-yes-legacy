module.exports = {
    name: "Egg Lord",
    id: "egg-lord",
    minHealth: 5000,
    maxHealth: 5000,
    minDefense: 90,
    maxDefense: 90,
    minAttack: 100,
    maxAttack: 100,
    moneyDrop: 10000,
    hidden: true,
    xpReward: 1254,
    drops: [
        { min: 1, max: 2, item: "ice-cube", chance: 0.5 },
        { min: 15, max: 50, item: "voidv_", chance: 0.75 }
    ]
}
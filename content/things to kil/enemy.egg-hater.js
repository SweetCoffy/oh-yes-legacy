module.exports = {
    name: "Egg Hater",
    id: "egg-hater",
    description: "The average egg hater",
    minHealth: 10,
    maxHealth: 40,
    minDefense: 0.1,
    maxDefense: 0.5,
    minAttack: 0.5,
    maxAttack: 3,
    moneyDrop: 750,
    minLevel: 0,
    xpReward: 101,
    drops: [
        { min: 5, max: 25, item: "v_", chance: 0.75 },
        { min: 1, max: 1, item: "titanium-pickaxe", chance: 0.01 }
    ]
}
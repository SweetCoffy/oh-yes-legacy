module.exports = {
    name: "Egg Hater",
    id: "egg-hater",
    description: "The average egg hater",
    minHealth: 25,
    maxHealth: 50,
    minDefense: 0,
    maxDefense: 3,
    minAttack: 1,
    maxAttack: 6,
    moneyDrop: 750,
    minLevel: 0,
    rarity: 0,
    xpReward: 101,
    drops: [
        { min: 5, max: 25, item: "v_", chance: 0.75 },
        { min: 1, max: 1, item: "titanium-pickaxe", chance: 0.01 }
    ]
}
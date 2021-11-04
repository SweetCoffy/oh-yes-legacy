module.exports = {
    name: "Shadow Realm Creature",
    id: "shadow-realm-creature",
    description: "A creature that came from the shadow realm, it is unknown how it escaped",
    minHealth: 100,
    maxHealth: 250,
    minDefense: 30,
    maxDefense: 70,
    minAttack: 50,
    maxAttack: 150,
    moneyDrop: 12500,
    minLevel: 200,
    rarity: 5,
    xpReward: 352,
    drops: [
        { item: "v_", chance: 1, min: 20, max: 56 },
        { item: "braincell", chance: 1, min: 1, max: 10 }
    ]
}
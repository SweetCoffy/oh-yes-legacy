const { rarity } = require("../../stuff")
const stuff = require("../../stuff")

module.exports = {
    name: "Sebo2205 Marketable Plushie",
    description: "no",
    unlisted: true,
    currency: "sun",
    price: 0.01,
    rarity: rarity.yellow,
    excludeFromGifts: true,
    addedMultiplier: 10000000000000000000000000000,
    multiplierMultiplier: 1000000000000000000000000000000000,
    icon: "<:sebo2205_but_updated:836691037887922216>",
    onEquip(user) {
        stuff.addMultiplier(user, 10000000000000000000000000000)
        stuff.addMaxHealth(user, 1000000000000)
        stuff.addMultiplierMultiplier(user, 1000000000000000000000000000000000)
        stuff.addAttack(user, 30000000000  )
        stuff.addDefense(user, 25000000000 )
    },
    onUnequip(user) {
        stuff.addMultiplier(user, -10000000000000000000000000000)
        stuff.addMaxHealth(user, -1000000000000)
        stuff.addMultiplierMultiplier(user, -1000000000000000000000000000000000)
        stuff.addAttack(user, -30000000000  )
        stuff.addDefense(user, -25000000000 )
    }
}
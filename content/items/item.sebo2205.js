const stuff = require("../../stuff")

module.exports = {
    name: "Sebo2205",
    description: "Ha ha yes the bot's developer as an item",
    unlisted: true,
    currency: "sun",
    price: 0.01,
    excludeFromGifts: true,
    addedMultiplier: 10000000000000000000,
    multiplierMultiplier: 1000000000000000000000000,
    icon: "<:sebo2205:820060806774521948>",
    onEquip(user) {
        stuff.addMultiplier(user, 10000000000000000000)
        stuff.addMaxHealth(user, 1000000)
        stuff.addMultiplierMultiplier(user, 1000000000000000000000000)
    },
    onUnequip(user) {
        stuff.addMultiplier(user, -10000000000000000000)
        stuff.addMaxHealth(user, -1000000)
        stuff.addMultiplierMultiplier(user, -1000000000000000000000000)
    }
}
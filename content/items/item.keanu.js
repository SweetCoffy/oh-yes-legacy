const stuff = require("../../stuff")

module.exports = {
    name: "Keanu™️ Marketable Plushie",
    icon: "<:keanunt:769710477944291338>",
    unlisted: true,
    price: 0.001,
    excludeFromGifts: true,
    multiplierMultiplier: 750000000000000000n,
    currency: "sun",
    onEquip(user) {
        stuff.addMultiplierMultiplier(user, 750000000000000000)
    },
    onUnequip(user) {
        stuff.addMultiplierMultiplier(user, -750000000000000000)
    }
}
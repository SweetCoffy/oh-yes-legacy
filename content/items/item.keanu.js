const stuff = require("../../stuff")
const { rarity } = require("../../stuff");

module.exports = {
    name: "Keanu™️ Marketable Plushie",
    icon: "<:kanu:836691660384632833>",
    unlisted: true,
    price: 0.001,
    rarity: rarity.yellow,
    excludeFromGifts: true,
    currency: "sun",
    multiplierMultiplier: 750000000000000000n,
    onEquip(user) {
        stuff.addMultiplierMultiplier(user, 750000000000000000)
        stuff.addAttack(user, 3000000  )
        stuff.addDefense(user, 2500000 )
    },
    onUnequip(user) {
        stuff.addMultiplierMultiplier(user, -750000000000000000)
        stuff.addAttack(user, 32000000 )
        stuff.addDefense(user, -5000000)
    }
}
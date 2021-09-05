const { rarity } = require("../../stuff");
const stuff = require("../../stuff");

module.exports = {
    name: "Peter1905 Marketable Plushie",
    icon: "<:weeb:821496939710906423>",
    description: "Pulsating with weeb energy",
    unlisted: true,
    currency: "sun",
    price: 0.12,
    rarity: rarity.yellow,
    multiplierMultiplier: 1000000000000000000n,
    onEquip(user) {
        stuff.addMultiplierMultiplier(user, 1000000000000000000)
    },
    onUnequip(user) {
        stuff.addMultiplierMultiplier(user, -1000000000000000000)
    }
}
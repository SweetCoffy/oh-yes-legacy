var stuff = require('../../stuff')
module.exports = {
    name: "Apple",
    icon: "🍎",
    inStock: 999999999,
    price: 20,
    addedMultiplier: .1,
    rarity: stuff.rarity.white,
    extraInfo: `Increases max HP by a very small amount`,
    onUse(user) {
        stuff.addMultiplier(user, .1)
        stuff.addMaxHealth(user, 0.001);
        stuff.removeItem(user, "apple")
    }
}
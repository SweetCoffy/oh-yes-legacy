var stuff = require('../../stuff')
module.exports = {
    name: "Apple",
    icon: "🍎",
    inStock: 999999999,
    price: 20,
    addedMultiplier: .1,
    rarity: stuff.rarity.white,
    extraInfo: `Very healthy apple, Increases max HP and defense by a very small amount`,
    onUse(user) {
        stuff.addMultiplier(user, .1)
        stuff.addMaxHealth(user, 0.005);
        stuff.addDefense(user, 0.0007);
        stuff.removeItem(user, "apple")
    }
}
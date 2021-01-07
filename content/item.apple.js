var stuff = require('../stuff')
module.exports = {
    name: "Apple",
    icon: "🍎",
    inStock: 999999999,
    price: 20,
    addedMultiplier: 15,
    rarity: stuff.rarity.white,
    onUse(user) {
        stuff.addMultiplier(user, 15)
        stuff.removeItem(user, "apple")
    }
}
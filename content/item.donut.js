var stuff = require('../stuff')
module.exports = {
    name: "Donut",
    icon: "🍩",
    inStock: 999999999,
    price: 10,
    addedMultiplier: 5,
    rarity: stuff.rarity.white,
    onUse(user) {
        stuff.addMultiplier(user, 5)
        stuff.removeItem(user, "donut")
    }
}
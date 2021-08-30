var stuff = require('../../stuff')
module.exports = {
    name: "Apple",
    icon: "🍎",
    inStock: 999999999,
    price: 20,
    addedMultiplier: .1,
    rarity: stuff.rarity.white,
    extraInfo: `Does very minor improvements to stats but doesn't decrease defense unlike donuts`,
    onUse(user) {
        stuff.addMultiplier(user, .1)
        stuff.removeItem(user, "apple")
    }
}
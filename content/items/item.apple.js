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
        stuff.addAttack(user, 0.01)
        stuff.userHealth[user] += .05;
        stuff.addMaxHealth(user, 0.05)
        stuff.removeItem(user, "apple")
    }
}
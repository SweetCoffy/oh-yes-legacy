var stuff = require('../../stuff')
module.exports = {
    name: "Donut",
    icon: "🍩",
    inStock: 999999999,
    price: 10,
    addedMultiplier: 5,
    rarity: stuff.rarity.white,
    extraInfo: `Donut made out of pure sugar, increases speed by a very small amount`,
    onUse(user) {
        stuff.addMultiplier(user, 5)
        stuff.addSpeed(user, 0.001);
        stuff.removeItem(user, "donut")
    }
}
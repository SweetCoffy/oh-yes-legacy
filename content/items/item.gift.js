var stuff = require('../../stuff')
module.exports = {
    name: "Gift",
    icon: "🎁",
    currency: "gold",
    rarity: stuff.rarity.purple,
    extraInfo: "Contains a random item, every item has an equal chance of being obtained",
    price: 10000000000,
    onUse(user) {
        var l = Object.entries(stuff.shopItems).filter(e => !e[1].excludeFromGifts).map(el => el[0])
        var i = l[Math.floor(Math.random() * l.length)]
        console.log(i)
        stuff.addItem(user, i)
        stuff.removeItem(user, "gift")
    }
}
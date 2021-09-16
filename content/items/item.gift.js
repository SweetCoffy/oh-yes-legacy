var stuff = require('../../stuff')
module.exports = {
    name: "Gift",
    icon: "🎁",
    currency: "gold",
    rarity: stuff.rarity.purple,
    price: 10000000000,
    onUse(user) {
        var l = Object.entries(stuff.shopItems).filter(e => !e[1].excludeFromGifts).map(el => el[0])
        var i = l[Math.floor(Math.random() * l.length)]
        stuff.addItem(user, l[i])
        stuff.removeItem(user, "gift")
    }
}
// 📘
const stuff = require("../../stuff");

module.exports = {
    name: "Book of Smort",
    icon: "📘",
    extraInfo: "Increases your tetrative by a very small amount",
    rarity: stuff.rarity.purple,
    //veModeExclusive: true,
    currency: "braincell",
    price: 100,
    onUse(user) {
        stuff.removeItem(user, "smort-book")
        stuff.addTetrative(user, 0.01)
    }
}
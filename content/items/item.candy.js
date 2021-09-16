// 🍬
var stuff = require('../../stuff')
module.exports = {
    name: 'Candy',
    icon: '🍬',
    price: 9999999999999,
    inStock: 999999999,
    rarity: 15543583,
    currency: "gold",
    description: 'mm yes, totally not taken from pokemon games',
    type: 'Consumable',
    extraInfo: 'Candy made out of comically oversized amounts of pure sugar and pure xp, makes you level up (and also get diabetes)',
    onUse: function(user, message) {
        stuff.levelUp(user, null)
        stuff.removeItem(user, "candy");
        return true;
    }
}
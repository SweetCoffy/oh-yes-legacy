var stuff = require('../../stuff')
module.exports = {
    name: 'Braincell',
    price: 1,
    unlisted: true,
    icon: "🧠",
    currency: "cheesy-way",
    onUse(user) {
        stuff.addMoney(user, 1, "braincell")
        stuff.removeItem(user, 'braincell')
    }
}
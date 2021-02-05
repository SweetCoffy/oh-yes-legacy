var stuff = require('../../stuff')
module.exports = {
    price: 9999999999,
    name: "Gift",
    icon: "🎁",
    inStock: 999999999,
    rarity: stuff.rarity.red,
    type: "idk",
    onUse(user, message) {
        var possibleItems = Object.keys(stuff.shopItems)
        var itemID = possibleItems[Math.floor(Math.random() * possibleItems.length)]
        var item = stuff.shopItems[itemID]
        stuff.addItem(user, itemID)
        stuff.removeItem(user, 'gift')
        return item;
    },
    onBulkUse(_user, data, message) {
        message.channel.send(`The gift(s) contained the following item(s):\n${data.map(el => `${el.icon} **${el.name}**`).join("\n")}`);
    }
}
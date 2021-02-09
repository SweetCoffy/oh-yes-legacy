var stuff = require('../../stuff')
module.exports = {
    name: "Battery",
    description: "ha ha yes another useless item",
    price: 1000,
    inStock: 999999,
    rarity: stuff.rarity.green,
    extraData: {
        charge: 100,
        quality: 1,
    },
    icon: "🔋",
    onUse(user, _message, _args, slot) {
        var _slot = stuff.getInventory(user).map(el => el.id).indexOf('phone')
        if (_slot < 0) return;
        var data = stuff.readItemData(user, slot)
        stuff.writeItemData(user, _slot, { battery: data })
        stuff.removeItem(user, "battery")
    }
}
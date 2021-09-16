var stuff = require('../../stuff')
module.exports = {
    name: "Fishing Rod™️",
    description: "Fish not included",
    icon: "🎣",
    rarity: stuff.rarity.white,
    price: 50,
    extraData: {
        durability: 100,
    },
    stackable: false,
    getInvInfo(item) {
        return `(${item.extraData.durability.toFixed(1)}%)`
    },
    onUse(user, message, _args, slot) {
        var possibleFish = Object.values(stuff.fishes)
        var durability = stuff.getItemProperty(user, slot,'durability');
        stuff.setItemProperty(user, slot, 'durability', durability - (Math.random() * 5))
        if (durability <= 0) {stuff.db.delete(`/${user}/inventory[${slot}]`); return}
        for (var f of possibleFish) {
            if (Math.random() < f.chance) stuff.addItem(user, f.id, f.extraData)
        }
    },
}
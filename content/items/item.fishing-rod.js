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
    onUse(user, message, _args, slot) {
        var possibleFish = Object.values(stuff.fishes)
        var durability = stuff.getItemProperty(user, slot,'durability');
        stuff.setItemProperty(user, slot, 'durability', durability - (Math.random() * 5))
        if (durability <= 0) {stuff.db.delete(`/${user}/inventory[${slot}]`); message.reply(`Your fishing rod broke`)}
        var f = possibleFish[Math.floor(possibleFish.length * Math.random())]
        stuff.addItem(user, f.id, f.extraData)
        return f.id
    },
    onBulkUse(_user, data, message) {
        var items = data.map(el => stuff.shopItems[el])
        var embed = {
            title: "You got",
            description: `${items.map(el => `${el.icon} ${el.name}`).join('\n')}`
        }
        message.channel.send({embed: embed})
    }
}
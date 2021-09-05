var stuff = require('../../stuff')
module.exports = {
    name: `Egg`,
    icon: ":egg:",
    price: 1000000,
    inStock: 999999999,
    rarity: stuff.rarity.pink,
    addedMultiplier: 750000,
    description: "It's eggcellent!",
    extraInfo: "Summons the Egg Lord\nDoes major improvements to stats",
    type: "Consumable & Boss summon",
    onUse: function(user, message) {
        stuff.addMultiplier(user, 750000)
        stuff.removeItem(user, "egg");
        setTimeout(() => {
            if (!stuff.fighting[user]) {
                stuff.startBattle(user, "egg-lord")
                message.channel.send("Egg Lord has awoken! Use ;hunt to fight it")
            }
        }, 1000)
        return true;
    }
}
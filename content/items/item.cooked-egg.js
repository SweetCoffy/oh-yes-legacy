var stuff = require('../../stuff')
module.exports = {
    name: 'Cooked egg',
    icon: ':cooking:',
    price: 187500000000,
    inStock: 999999999,
    rarity: 15543583,
    description: 'You should feel bad about that unborn chicken!',
    type: 'Consumable & Boss Summon',
    extraInfo: 'Summons Egg Lord Prime',
    addedMultiplier: 7,
    onUse: function(user, message) {
        stuff.addMultiplier(user, 7)
        stuff.removeItem(user, "cooked-egg");
        setTimeout(() => {
            if (!stuff.fighting[user]) {
                stuff.startBattle(user, "egg-lord-prime")
                message.channel.send("Egg Lord Prime has awoken! Use ;hunt to fight it")
            }
        }, 1000)
        return true;
    }
}
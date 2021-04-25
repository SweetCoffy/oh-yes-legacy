var stuff = require('../../stuff')
module.exports = {
    name: `Eggs`,
    icon: "<:eggs:830838662136201227>",
    price: 1000000000,
    inStock: 999999999,
    addedMultiplier: 750000000,
    description: "Donate them to the Sky Egg Lord!",
    type: "Consumable",
    extraInfo: "Increases max health by 20 until 1.6k max health\nFully recovers health\nDoes major improvements to stats",
    rarity: stuff.rarity.purple,
    onUse: function(user) {
        if (!(stuff.getMaxHealth(user) >= 1600)) stuff.db.push(`/${user}/maxHealth`, stuff.getMaxHealth(user) + 20)
        stuff.userHealth[user] = stuff.getMaxHealth(user);
        stuff.addMultiplier(user, 750000000)
        stuff.addAttack(user, 50)
        stuff.addDefense(user, 50)
        stuff.removeItem(user, "eggs");
        return true;
    }
}
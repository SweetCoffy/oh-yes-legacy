var stuff = require('../stuff')
module.exports = {
    icon: '🛢️',
    type: 'idk',
    inStock: 100000,
    rarity: stuff.rarity.red,
    price: 750000,
    name: "Oil Can",
    description: 'oh no',
    veModeExclusive: true,
    onUse(user) {
        stuff.removeItem(user, 'oil-can')
        if (stuff.currentBoss) {
            stuff.currentBoss.health /= 1.1;
        }
        Object.entries(stuff.userHealth).forEach(h => {
            stuff.userHealth[h[0]] /= 1.5;

        })
    }
}
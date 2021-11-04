const stuff = require("../../stuff");
var colors = [
    0xff0000,
    0xff7000,
    0xffff00,
    0x00ff00,
    0x0000ff,
    0x4b0082,
    0xff00ff,
]
var i = 0
module.exports = {
    name: "ú marketable plushie",
    icon: "<:u_:894183262170263615>",
    unlisted: true,
    price: 3458732645385346345645637286452347534545756,
    currency: "cheesy-way",
    description: "Makes you become as powerful as ú",
    excludeFromGifts: true,
    get rarity() { 
        if (i >= colors.length) i = 0;
        return colors[i++]
    },
    onEquip(u) {
        stuff.addAttack(u, stuff.enemies.u.maxAttack)
        stuff.addDefense(u, stuff.enemies.u.maxDefense)
        stuff.addMaxHealth(u, stuff.enemies.u.maxHealth)
    },
    onUnequip(u) {
        stuff.addAttack(u, -stuff.enemies.u.maxAttack)
        stuff.addDefense(u, -stuff.enemies.u.maxDefense)
        stuff.addMaxHealth(u, -stuff.enemies.u.maxHealth)
    }
}
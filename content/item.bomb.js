const stuff = require("../stuff");
module.exports = {
    icon: "💣",
    name: "Bomb",
    price: 999999,
    unlisted: true,
    rarity: stuff.rarity.pink,
    async onUse(user, message) {
        stuff.removeItem(user, 'bomb')
        var msg = await message.channel.send('💣')
        setTimeout(() => {
            msg.edit('💥')
            if (stuff.currentBoss) {
                stuff.currentBoss.health /= 4;
                message.channel.send(`${stuff.currentBoss.name} now has ${stuff.format(stuff.currentBoss.health)} health`);
            }
            Object.entries(stuff.userHealth).forEach(h => {
                stuff.userHealth[h[0]] /= 4;
            })
        }, 5000) 
    }
}
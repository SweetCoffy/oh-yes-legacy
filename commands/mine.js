const { mine, shopItems, getInventory, format } = require('../stuff');

module.exports = {
    name: "mine",
    description: "totally not a mining simulator ripoff",
    cooldown: 1.5,
    category: "economy",
    execute(message, args) {
        var slot = getInventory(message.author.id).map(el => shopItems[el.id].type).lastIndexOf("Pickaxe");
        if (slot < 0) throw "You don't have a pickaxe!"
        const h = mine(message.author.id, slot);
        
        var embed = {
            title : "You mined stuff",
            fields: [
                {
                    name: "You found",
                    value: h.items.map(el => `${el.amount}x ${shopItems[el.id].icon} **${shopItems[el.id].name}**`).join("\n")
                },
                {
                    name: `Your pickaxe`,
                    value: `\`${format(h.oldPickaxe.durability)}\` -> \`${format(h.pickaxe.durability)}\``
                }
            ]
        }
        message.channel.send({embed: embed});
    }
}
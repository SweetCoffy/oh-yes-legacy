const stuff = require("../stuff")

module.exports = {
    name: "inv-item-info",
    description: "shows the data of an item in your inventory",
    useArgsObject: true,
    category: "economy",
    arguments: [
        {
            name: "item",
            type: "inventoryItem",
            description: "The item to show it's data"
        }
    ],
    aliases: ['invitem', 'inventory-item', 'inventoryitem'],
    execute(message, args) {
        var i = stuff.getInventory(message.author.id)[args.item]
        if (!i) throw `You don't have an item at slot \`${args.item}\``
        if (!i) throw `The item ${i.icon} ${i.name} doesn't have data`
        var embed = {
            title: `Item data: ${i.icon} ${i.name}`,
            description: stuff.listProperties(i)
        }
        message.channel.send({embed: embed});
    }
}
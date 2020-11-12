const stuff = require("../stuff")

module.exports = {
    name: "inv-item-info",
    description: "shows the data of an item in your inventory",
    useArgsObject: true,
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
        if (!i.extraData) throw `The item ${i.icon} ${i.name} doesn't have data`
        var embed = {
            title: `Item data: ${i.icon} ${i.name}`,
            description: Object.entries(i.extraData).map(el => `${stuff.thing(el[0])}: ${typeof el[1] == 'number' ? stuff.format(el[1]) : el[1].toString()}`).join("\n")
        }
        message.channel.send({embed: embed});
    }
}
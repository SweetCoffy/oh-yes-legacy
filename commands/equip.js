const stuff = require("../stuff");
module.exports = {
    name: "equip",
    description: "equips an item lol",
    arguments: [
        {
            name: "item",
            type: "inventoryItem",
            description: 'The item to equip'
        }
    ],
    useArgsObject: true,
    execute(message, args) {
        var slot = args.item;
        stuff.addEquipment(message.author.id, slot);
        message.channel.send(`ha ha yes you equipped the item at slot \`${slot}\``);
    }
}
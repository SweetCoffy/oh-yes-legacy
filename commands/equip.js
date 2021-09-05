const stuff = require("../stuff");
module.exports = {
    name: "equip",
    description: "equips an item lol",
    arguments: [
        {
            name: "item",
            type: "string",
            description: 'The item to equip'
        },
        {
            name: "amount",
            type: "int",
            description: `The amount of items to equip`,
            optional: true,
            default: 1,
        }
    ],
    useArgsObject: true,
    execute(message, args) {
        stuff.repeat(() => {
            var inv = stuff.getInventory(message.author.id)
            var slot = inv.findIndex(el => el.id == args.item);
            stuff.addEquipment(message.author.id, slot);
        }, stuff.clamp(args.amount, 1, stuff.getConfig('massEquipLimit'))).then(([times, err]) => {
            console.log(err)
            if (times <= 0 && err) stuff.sendError(message.channel, err)
            if (times > 0) message.channel.send(`ha ha yes you equipped ${times} items`);
        })
    }
}
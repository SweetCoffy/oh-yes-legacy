const stuff = require('../stuff');

module.exports = {
    name: "gift",
    category: "economy",
    description: "Gives one of your items to another user",
    useArgsObject: true,
    arguments: [
        {
            name: "item",
            type: "inventoryItem"
        },
        {
            name: "repeat",
            type: "positiveInt",
        },
        {
            name: "user",
            type: "user",
        }
    ],
    cooldown: 4,

    execute(message, args, _extraArgs, extraArgs) {
        var author = message.author.id;
        var repeatAmount = stuff.clamp(args.repeat, 1, stuff.getConfig("massGiftLimit"));
        var inv = stuff.getInventory(author);
        var tinv = stuff.getInventory(args.user.id)
        stuff.repeat(() => {
            var slot = args.item
            if (isNaN(args._item)) {
                slot = inv.findIndex(el => el.id == args._item)
            }
            var it = inv[slot];
            if (!it) throw `you don't have an item at slot \`${slot}\``
            tinv.push(it)
            inv.splice(slot, 1)
        }, repeatAmount).then(([iter, err, data]) => {
            if (err && iter <= 0) stuff.sendError(message.channel, err)
            if (iter > 0) message.channel.send(`Gave ${iter} items to ${args.user}!`)
        })
    }
}
const stuff = require('../stuff');

module.exports = {
    name: "use",
    category: "economy",
    description: "use an item ~~what did you expect lol~~",
    useArgsObject: true,
    arguments: [
        {
            name: "item",
            type: "inventoryItem"
        },
        {
            name: "repeat",
            type: "positiveInt",
            default: 1,
            optional: true,
        },
        {
            name: "args",
            type: "string",
            default: "",
            optional: true,
        }
    ],
    cooldown: 4,

    execute(message, args, _extraArgs, extraArgs) {
        var p = stuff.pvp[message.author.id]
        if (args.length < 1) throw "e"; 
        if (p) throw `You can't use items while in a pvp match!`
        var author = message.author.id;
        var itName = args._item;
        var repeatAmount = stuff.clamp(args.repeat, 1, stuff.getConfig("massUseLimit"));
        var inv = stuff.getInventory(author);
        stuff.repeat(() => {
            var h;
            var slot = args.item
            if (isNaN(args._item)) {
                slot = inv.findIndex(el => el.id == args._item)
            }
            var it = inv[slot];
            if (!it) throw `you don't have an item at slot \`${slot}\``
            return stuff.shopItems[it.id].onUse(author, message, args.args.split(" "), slot);
        }, repeatAmount).then(([iter, err, data]) => {
            if (err && iter <= 0) stuff.sendError(message.channel, err)
            
                if (stuff.shopItems[itName]) {
                    var onBulkUse = stuff.shopItems[itName].onBulkUse;
                    if (onBulkUse && data.length > 0) {
                        onBulkUse(message.author.id, data, message)
                    }
                }
                if (iter > 0) message.channel.send(`You used ${iter} items!`)
            
        })
    }
}
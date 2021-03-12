const stuff = require('../stuff');

module.exports = {
    name: "use",
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
        if (args.length < 1) throw "e"; 
        var author = message.author.id;
        var itName = args._item;
        var repeatAmount = stuff.clamp(args.repeat, 1, stuff.getConfig("massUseLimit"));
        stuff.repeat(() => {
            var h;
            var slot = args.item
            if (isNaN(args._item)) {
                slot = stuff.getInventory(author).map(el => el.id).indexOf(args._item)
            }
            var it = stuff.getInventory(author)[slot];
            if (it == undefined) throw `you don't have an item at slot \`${slot}\``
            h = stuff.shopItems[it.id].onUse(author, message, args.args.split(" "), slot)
            return h;
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
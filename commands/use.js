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
    cooldown: 2,

    execute(message, args, _extraArgs, extraArgs) {
        if (args.length < 1) throw "e"; 
        var author = message.author.id;
        var itName = args._item;
        var sell = extraArgs.sell;
        var totalSoldIp = 0;
        var totalSoldGold = 0;
        var repeatAmount = stuff.clamp(args.repeat, 1, stuff.getConfig("massBuyLimit"));
        stuff.repeat(() => {
            var h;
            var slot = args.item
            if (isNaN(args._item)) {
                slot = stuff.getInventory(author).map(el => el.id).indexOf(args._item)
            }
            var it = stuff.getInventory(author)[slot];
            if (it == undefined) throw `you don't have an item at slot \`${slot}\``
            if (!sell) {
                h = stuff.shopItems[it.id].onUse(author, message, args.args.split(" "), slot)
            } else {
                var price = stuff.shopItems[it.id].price / 2 || 0;
                if (stuff.shopItems[it.id].currency != "gold") totalSoldIp += price;
                if (stuff.shopItems[it.id].currency != "gold") stuff.addPoints(message.author.id, price, `Sold ${it.icon} ${it.name}`);
                if (stuff.shopItems[it.id].currency == "gold") totalSoldGold += price;
                if (stuff.shopItems[it.id].currency == "gold") stuff.addGold(message.author.id, price);
                stuff.removeItem(message.author.id, it.id)
            }
            return h;
        }, repeatAmount).then(([iter, err, data]) => {
            if (err) stuff.sendError(message.channel, err)
            if (!sell) {
                if (stuff.shopItems[itName]) {
                    var onBulkUse = stuff.shopItems[itName].onBulkUse;
                    if (onBulkUse && data.length > 0) {
                        onBulkUse(message.author.id, data, message)
                    }
                }
                message.channel.send(`You used ${iter} items!`)
            }
            if (sell) message.channel.send(`You sold ${iter} items for __**${stuff.format(totalSoldIp)}**__ <:ip:770418561193607169> and __**${stuff.format(totalSoldGold)}**__ :coin:!`)
        })
    }
}
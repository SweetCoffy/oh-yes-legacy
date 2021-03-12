const stuff = require('../stuff');

module.exports = {
    name: "sell",
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
    ],
    cooldown: 5,

    execute(message, args, _extraArgs, extraArgs) {
        var author = message.author.id;
        var totalSoldIp = 0;
        var totalSoldGold = 0;
        var s = stuff.shopItems
        var repeatAmount = stuff.clamp(args.repeat, 1, stuff.getConfig("massBuyLimit"));
        stuff.repeat(() => {
            var slot = args.item
            if (isNaN(args._item)) {
                slot = stuff.getInventory(author).map(el => el.id).indexOf(args._item)
            }
            var it = stuff.getInventory(author)[slot];
            if (!it) throw `you don't have an item at slot \`${slot}\``
            var price = s[it.id].price * stuff.stonks[it.id].mult || 0;
            if (s[it.id].currency != "gold") {
                totalSoldIp += price;
                stuff.addPoints(message.author.id, price);
            }
            if (s[it.id].currency == "gold") {
                totalSoldGold += price;
                stuff.addGold(message.author.id, price);
            }
            stuff.removeItem(message.author.id, it.id)
        }, repeatAmount).then(([iter, err]) => {
            if (err && iter <= 0) stuff.sendError(message.channel, err)
            else if (iter > 0) message.channel.send(`Sold ${iter} items for __**${stuff.format(totalSoldIp)}**__ <:ip:770418561193607169> and __**${stuff.format(totalSoldGold)}**__ :coin:!`)
        })
    }
}
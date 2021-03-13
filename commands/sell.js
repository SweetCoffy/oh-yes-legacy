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
        var s = stuff.shopItems
        var totalSold = {}
        Object.keys(stuff.currencies).forEach(el => totalSold[el] = 0)
        var repeatAmount = stuff.clamp(args.repeat, 1, stuff.getConfig("massBuyLimit"));
        var inv = stuff.getInventory(author);
        stuff.repeat(() => {
            var slot = args.item
            if (isNaN(args._item)) {
                slot = inv.findIndex(el => el.id == args._item)
            }
            var it = inv[slot];
            if (!it) throw `you don't have an item at slot \`${slot}\``
            var price = s[it.id].price * stuff.stonks[it.id].mult || 0;
            stuff.addMoney(message.author.id, price, stuff.shopItems[it.id].currency || "ip");
            stuff.removeItem(message.author.id, it.id)
            totalSold[it.currency || "ip"] += price;
        }, repeatAmount).then(([iter, err]) => {
            var a = Object.entries(totalSold).filter(el => el[1] > 0).map(el => `${stuff.currencies[el[0]].icon} ${stuff.format(el[1])}`)
            if (err && iter <= 0) stuff.sendError(message.channel, err)
            else if (iter > 0) message.channel.send(`Sold ${iter} items for ${a.join(" ")}`)
        })
    }
}
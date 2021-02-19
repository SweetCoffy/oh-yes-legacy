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
    cooldown: 2,

    execute(message, args, _extraArgs, extraArgs) {
        var author = message.author.id;
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
            
            var price = stuff.shopItems[it.id].price * stuff.stonks[it.id].mult || 0;
            if (stuff.shopItems[it.id].currency != "gold") totalSoldIp += price;
            if (stuff.shopItems[it.id].currency != "gold") stuff.addPoints(message.author.id, price, `Sold ${it.icon} ${it.name}`);
            if (stuff.shopItems[it.id].currency == "gold") totalSoldGold += price;
            if (stuff.shopItems[it.id].currency == "gold") stuff.addGold(message.author.id, price);
            stuff.removeItem(message.author.id, it.id)
            
            return h;
        }, repeatAmount).then(([iter, err]) => {
            if (err) stuff.sendError(message.channel, err)
            message.channel.send(`Sold ${iter} items for __**${stuff.format(totalSoldIp)}**__ <:ip:770418561193607169> and __**${stuff.format(totalSoldGold)}**__ :coin:!`)
        })
    }
}
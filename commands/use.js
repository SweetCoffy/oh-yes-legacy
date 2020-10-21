const stuff = require('../stuff');

module.exports = {
    name: "use",
    description: "use an item ~~what did you expect lol~~",
    usage: "use <itemIndex:int> [repeat:int=1]",
    cooldown: 3,

    execute(message, args, _extraArgs, extraArgs) {
        var author = message.author.id;
        var sell = extraArgs.sell;
        var totalSoldIp = 0;
        var totalSoldGold = 0;
        var repeatAmount = stuff.clamp(parseInt(args[1]) || 1, 1, 500);
        stuff.repeat(() => {
            var it = stuff.getInventory(author)[parseInt(args[0])];
            if (it == undefined) throw `you don't have an item at slot \`${parseInt(args[0])}\``
            if (!sell) {
                var onUse = stuff.shopItems[it.id].onUse;
                if (onUse(author, message, args.slice(1), parseInt(args[0])) && repeatAmount < 2) {
                    message.channel.send(`You used the item ${it.icon} ${it.name}!`);
                }
            } else {
                var price = stuff.shopItems[it.id].price / 2 || 0;
                if (stuff.shopItems[it.id].currency != "gold") totalSoldIp += price;
                if (stuff.shopItems[it.id].currency != "gold") stuff.addPoints(message.author.id, price);
                if (stuff.shopItems[it.id].currency == "gold") totalSoldGold += price;
                if (stuff.shopItems[it.id].currency == "gold") stuff.addGold(message.author.id, price);
                stuff.removeItem(message.author.id, it.id)
            }
        }, repeatAmount).then(([iter, err]) => {
            if (!sell) message.channel.send(`You used ${iter} items!`)
            if (sell) message.channel.send(`You sold ${iter} items for __**${stuff.format(totalSoldIp)}**__ <:ip:763937198764326963> and __**${stuff.format(totalSoldGold)}**__ :coin:!`)
            if (err) stuff.sendError(message.channel, err)
        })
    }
}
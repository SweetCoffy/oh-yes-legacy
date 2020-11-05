const stuff = require('../stuff');

module.exports = {
    name: "use",
    description: "use an item ~~what did you expect lol~~",
    usage: "use <itemIndex:int> [repeat:int=1]",
    cooldown: 2,

    execute(message, args, _extraArgs, extraArgs) {
        if (args.length < 1) throw "e"; 
        var author = message.author.id;
        var itName = args[0].toLowerCase();
        var sell = extraArgs.sell;
        var totalSoldIp = 0;
        var totalSoldGold = 0;
        var repeatAmount = stuff.clamp(parseInt(args[1]) || 1, 1, stuff.getConfig("massBuyLimit"));
        stuff.repeat(() => {
            var slot = stuff.getInventory(author).map(el => el.id).indexOf(itName)
            var it = stuff.getInventory(author)[slot];
            if (it == undefined) throw `you don't have an item at slot \`${slot}\``
            if (!sell) {
                var onUse = stuff.shopItems[it.id].onUse;
                if (onUse(author, message, args.slice(1), slot) && repeatAmount < 2) {
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
            if (sell) message.channel.send(`You sold ${iter} items for __**${stuff.format(totalSoldIp)}**__ <:ip:770418561193607169> and __**${stuff.format(totalSoldGold)}**__ :coin:!`)
            if (err) stuff.sendError(message.channel, err)
        })
    }
}
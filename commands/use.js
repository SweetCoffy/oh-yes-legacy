const stuff = require('../stuff');

module.exports = {
    name: "use",
    description: "use an item ~~what did you expect lol~~",
    usage: "use <itemIndex:int> [repeat:int=1]",
    cooldown: 10,

    execute(message, args) {
        var author = message.author.id;
        var repeatAmount = stuff.clamp(parseInt(args[1]) || 1, 1, 150);
        stuff.repeat(() => {
            var it = stuff.getInventory(author)[parseInt(args[0])];
            if (it == undefined) throw `you don't have an item at slot \`${parseInt(args[0])}\``
            var onUse = stuff.shopItems[it.id].onUse;
            if (onUse(author, message, args.slice(1), parseInt(args[0])) && repeatAmount < 2) {
                message.channel.send(`You used the item ${it.icon} ${it.name}!`);
            }
        }, repeatAmount).then(iter => {
            message.channel.send(`You used ${iter} items!`)
        })
    }
}
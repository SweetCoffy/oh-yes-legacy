const stuff = require('../stuff');

module.exports = {
    name: "use",
    description: "use an item ~~what did you expect lol~~",
    usage: "use <itemIndex:int>",

    execute(message, args) {
        var author = message.author.id;
        var it = stuff.getInventory(author)[parseInt(args[0])];
        if (it == undefined) throw `you don't have an item at slot \`${parseInt(args[0])}\``
        var onUse = stuff.shopItems[it.id].onUse;
        if (onUse(author, message, args.slice(1))) {
            message.channel.send(`You used the item ${it.icon} ${it.name}!`);
        }
    }
}
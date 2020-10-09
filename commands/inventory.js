const stuff = require('../stuff');

module.exports = {
    name: "inventory",
    description: "shows the items you currently have",
    execute(message, args) {
        var authorId = message.author.id;
        var inv = stuff.getInventory(authorId);
        var page = (parseInt(args[0]) || 1) - 1;
        var startFrom = 0 + (20 * page);

        
        if (inv.length < 1) {
            throw "you don't have any items in your inventory!"
        } else {
            var itemNames = [];
           

            var i = 0;
            inv.forEach(item => {
                itemNames.push(`\`${i}\` ${item.icon} ${item.name}`);
                i++;
            });

            var embed = {
                title: "inventory",
                description: itemNames.slice(startFrom, startFrom + 20).join("\n"),
                footer: {
                    text: `page ${page + 1}/${Math.floor(inv.length / 20) + 1}`
                }
            }
            message.channel.send({embed: embed});
        }
    }
}
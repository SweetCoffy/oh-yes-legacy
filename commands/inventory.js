const stuff = require('../stuff');

module.exports = {
    name: "inventory",
    description: "shows the items you currently have",
    execute(message, args) {
        var authorId = message.author.id;
        var inv = stuff.getInventory(authorId);
        
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
                description: itemNames.join("\n")
            }
            message.channel.send({embed: embed});
        }
    }
}
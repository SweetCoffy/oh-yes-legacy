const stuff = require("../stuff");


module.exports = {
    name: "craft",
    description: "oh god this bot is turning into a mining simulator ripoff",
    useArgsObject: true,
    arguments: [
        {
            name: "item",
            type: "string"
        }
    ],
    execute(message, args) {
        var craftable = stuff.craftables[args.item];
        if (!craftable) {
            var embed = {
                title: "craftable item list",
                description: Object.entries(stuff.craftables).map(el => {
                    var it = stuff.shopItems[el[1].id];
                    return `${it.icon} \`${el[1].id}\` **${it.name}**`;
                }).join("\n")
            }
            message.channel.send({embed: embed});
        } else {
            var canCraft = stuff.canCraft(args.item, message.author.id);
            if (canCraft) {
                var it = stuff.shopItems[craftable.id];
                craftable.ingredients.forEach(el => {
                    for (var i = 0; i < el.amount; i++) {
                        stuff.removeItem(message.author.id, el.id)
                    }
                })
                stuff.addItem(message.author.id, craftable.id);
                message.channel.send({embed: {
                    title: "ha ha yes",
                    description: `You crafted ${it.icon} **${it.name}** with the following items:\n${craftable.ingredients.map(el => `- ${el.amount}x ${stuff.shopItems[el.id].icon} **${stuff.shopItems[el.id].name}**`).join("\n")}`
                }})
            } else {
                throw "You can't craft this item!!!1!!1!!1"
            }
        }
    }
}
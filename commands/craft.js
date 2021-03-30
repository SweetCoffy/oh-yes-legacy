const stuff = require("../stuff");


module.exports = {
    name: "craft",
    description: "oh god this bot is turning into a mining simulator ripoff",
    useArgsObject: true,
    category: "economy",
    arguments: [
        {
            name: "item",
            type: "string"
        },
        {
            name: "amount",
            type: "int",
            optional: true,
            default: 1,
        }
    ],
    cooldown: 5,
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
            var it = stuff.shopItems[craftable.id];
            var repeat = stuff.clamp(args.amount || 1, 0, stuff.getConfig('massCraftLimit'))
            stuff.repeat(() => {
                var canCraft = stuff.canCraft(args.item, message.author.id);
                if (canCraft) {
                    stuff.addItem(message.author.id, craftable.id);
                    craftable.ingredients.forEach(el => {
                        for (var i = 0; i < el.amount; i++) {
                            var inv = stuff.db.data[message.author.id].inventory
                            var idx = inv.findIndex(e => e.id == el.id)
                            inv.splice(idx, 1)
                        }
                    })
                } else {
                    throw "You can't craft this item!!!1!!1!!1"
                }
            }, repeat).then(([iter, err]) => {
                if (err && iter < 1) stuff.sendError(message.channel, err)
                else if (iter > 0) {
                    message.channel.send({embed: {
                        title: "ha ha yes",
                        description: `You crafted ${iter}x ${it.icon} **${it.name}** with the following items:\n${craftable.ingredients.map(el => `- ${el.amount * iter}x ${stuff.shopItems[el.id].icon} **${stuff.shopItems[el.id].name}**`).join("\n")}`
                    }})
                }
            })
        }
    }
}
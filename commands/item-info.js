const CommandError = require("../CommandError");
const stuff = require("../stuff")

module.exports = {
    name: "item-info",
    description: "shows info about an item lololool",
    usage: "item-info <itemName>",
    execute(message, args) {
        var itemData = stuff.shopItems[args[0]];
        if (!itemData) throw new CommandError("Item not found", `could not find item: \`${args[0]}\``);
        var embed = {
            title: `${itemData.icon} ${itemData.name}`,
            fields: [
                {
                    name: "icon",
                    value: itemData.icon,
                    inline: true,
                },
                {
                    name: "internal name",
                    value: args[0],
                    inline: true,
                }
            ]
        }

        if (itemData.description) {
            embed.description = `*'${itemData.description}'*`
        }
        if (itemData.extraInfo) {
            if (!itemData.description) {
                embed.description = itemData.extraInfo;
            } else {
                embed.description += "\n\n" + itemData.extraInfo
            }
        }

        if (itemData.pet) {
            embed.fields.push({name: "spawned pet", value: itemData.pet.icon + " " + itemData.pet.name, inline: true});
            embed.fields.push({name: "pet multiplier", value: itemData.pet.baseMultiplierAdd || 250, inline: true});
            embed.fields.push({name: "pet food", value: `${stuff.shopItems[itemData.pet.food].icon} ${stuff.shopItems[itemData.pet.food].name} (\`${itemData.pet.food}\`)`, inline: true})
        }



        if (itemData.rarity) {
            embed.color = itemData.rarity;
        }

        if (itemData.addedMultiplier) {
            embed.fields.push({name: "multiplier", value: `+**${stuff.format(itemData.addedMultiplier)}** Multiplier`, inline: true})
        }

        if (itemData.price) {
            if (!itemData.unlisted) embed.fields.push({name: "buy price", value: stuff.format(itemData.price), inline: true})
            embed.fields.push({name: "sell price", value: stuff.format(itemData.price / 2 || 0), inline: true})
        }

        

        if (itemData.fields) {
            embed.fields.push(...itemData.fields)
        }

        if (itemData.multiplierMultiplier) {
            embed.fields.push({name: "exponent", value: `+**${stuff.format(itemData.multiplierMultiplier)}** exponent`, inline: true})
        }

        message.channel.send({embed: embed});
    }
}
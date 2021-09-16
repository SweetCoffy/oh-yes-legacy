const CommandError = require("../CommandError");
const stuff = require("../stuff")

module.exports = {
    name: "item-info",
    description: "shows info about an item lololool",
    usage: "item-info <itemName>",
    category: "economy",
    aliases: ["item", "iteminfo"],
    execute(message, args, _, extraArgs) {
        var itemData = stuff.shopItems[args[0]];
        if (!itemData) throw new CommandError("Item not found", `could not find item: \`${args[0]}\``);
        var embed = {
            title: `${itemData.icon} ${itemData.name} (${stuff.venezuelaMode ? 'Venezuela Mode' : 'Normal Mode'})`,
            fields: [
                {
                    name: "Icon",
                    value: itemData.icon,
                    inline: true,
                },
                {
                    name: "ID",
                    value: args[0],
                    inline: true,
                }
            ]
        }

        if (itemData.description) {
            embed.description = `*'${itemData.description}'*`
        }
        if (extraArgs.debug) {
            if (itemData.onEquip && itemData.onEquip.toString().length < 100) {
                embed.fields.push({
                    name: "onEquip() function",
                    value: `\`\`\`js\n${itemData.onEquip}\n\`\`\``
                })
            }
            if (itemData.onUnequip && itemData.onUnequip.toString().length < 100) {
                embed.fields.push({
                    name: "onUnequip() function",
                    value: `\`\`\`js\n${itemData.onUnequip}\n\`\`\``
                })
            }
            if (itemData.onUse && itemData.onUse.toString().length < 100) {
                embed.fields.push({
                    name: "onUse() function",
                    value: `\`\`\`js\n${itemData.onUse}\n\`\`\``
                })
            }
        }
        if (itemData.extraInfo) {
            if (!itemData.description) {
                embed.description = itemData.extraInfo;
            } else {
                embed.description += "\n\n" + itemData.extraInfo
            }
        }

        if (itemData.pet) {
            embed.fields.push({name: "Pet", value: itemData.pet.icon + " " + itemData.pet.name, inline: true});
            embed.fields.push({name: "Pet multiplier", value: itemData.pet.baseMultiplierAdd || 250, inline: true});
            embed.fields.push({name: "Pet food", value: `${stuff.shopItems[itemData.pet.food].icon} ${stuff.shopItems[itemData.pet.food].name} (\`${itemData.pet.food}\`)`, inline: true})
        }



        if (itemData.rarity) {
            embed.color = itemData.rarity;
        }

        if (itemData.addedMultiplier) {
            embed.fields.push({name: "Multiplier", value: `+**${stuff.format(itemData.addedMultiplier)}** Multiplier`, inline: true})
        }

        if (itemData.price) {
            embed.fields.push({name: "Buy/Sell price", value: `${stuff.currencies[itemData.currency || 'ip'].icon} ${stuff.format(itemData.price)} (+${(stuff.stonks[args[0]].percent * 100).toFixed(1)}%)`, inline: true})
        }
        var craftable = stuff.craftables[args[0]];
        if (craftable) {
            embed.fields.push({
                name: "Crafting recipe",
                value: craftable.ingredients.map(el => {
                    var it = stuff.shopItems[el.id];
                    return `${el.amount}x ${it.icon} **${it.name}**`
                }).join("\n")
            });
        }

        

        if (itemData.fields) {
            embed.fields.push(...itemData.fields)
        }

        if (itemData.extraData) {
            embed.fields.push({
                name: "Default data",
                value: Object.entries(itemData.extraData).map(el => `${stuff.thing(el[0])}: ${typeof el[1] == 'number' ? stuff.format(el[1]) : (el[1] + "")}`).join("\n")
            })
        }

        if (itemData.multiplierMultiplier) {
            embed.fields.push({name: "Exponent", value: `+**${stuff.format(itemData.multiplierMultiplier)}** exponent`, inline: true})
        }

        message.channel.send({embed: embed});
    }
}
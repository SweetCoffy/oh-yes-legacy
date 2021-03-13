const CommandError = require('../CommandError');
const stuff = require('../stuff')
module.exports = {
    name: "buy",
    description: "buys something from the shop",
    useArgsObject: true,
    arguments: [
        {
            name: "item",
            type: "string",
            optional: true,
            default: "",
            description: "The item to buy",
        },
        {
            name: "amount",
            type: "formattedNumber",
            optional: true,
            default: "1",
            description: "How many of `item` to buy"
        }
    ],
    aliases: ['shop'],
    cooldown: 5,
    execute(message, args, _extraArgs, _extraArgsObject, discount = 1) {
        var item = args.item;
        var amount = args.amount;
        var useOldShop = _extraArgsObject.oldShop || stuff.getUserConfig(message.author.id).useOldShop;
        var showHidden = _extraArgsObject.showHidden
        if (!item) {
            var entries = Object.entries(stuff.shopItems).sort(function(a, b) {
                return (b[1].price * stuff.currencies[b[1].currency || "ip"].value * (b[1].unlisted ? 0 : 1)) - (a[1].price * stuff.currencies[a[1].currency || "ip"].value * (a[1].unlisted ? 0 : 1));
            }).filter(el => {
                if (showHidden) return true;
                else return (!el[1].unlisted && el[1].price) 
            }).filter(el => {
                if (el[1].veModeExclusive && !stuff.venezuelaMode) return false;
                return true;
            })
            var userconfig = stuff.getUserConfig(message.author.id)
            var itemNames = []
            var page = (parseInt(_extraArgsObject.page) || 1) - 1;
            var itemsPerPage = useOldShop ? (stuff.clamp(userconfig.itemsPerPage, 1, 10) || 10) * 3: (stuff.clamp(userconfig.itemsPerPage, 1, 10) || 10)
            var startFrom = 0 + (itemsPerPage * page);

            entries.forEach(entry => {
                if (!useOldShop) itemNames.push(`${entry[1].icon} \`${entry[0]}\` **${entry[1].name}**${entry[1].unlisted ? ' (Unlisted)' : ''}${entry[1].price ? ` ─ ${(stuff.currencies[entry[1].currency] || stuff.currencies.ip).icon} __${stuff.format(entry[1].price * stuff.stonks[entry[0]].mult)}__ ` : ''}${(entry[1].type) ? ` ─ ${entry[1].type}` : ``}${(entry[1].extraInfo) ? `\n${entry[1].extraInfo}` : ``}`);
                if (useOldShop) itemNames.push(`${entry[1].icon} \`${entry[0]}\` **${entry[1].name}**${entry[1].unlisted ? ' (Unlisted)' : ''}${entry[1].price ? `, ${stuff.format(entry[1].price * stuff.stonks[entry[0]].mult)} ${(stuff.currencies[entry[1].currency] || stuff.currencies.ip).name}` : ``}`);
            })

            var embed = {
                title: "Shop",
                color: 0x34a1eb,
                description: itemNames.slice(startFrom, startFrom + itemsPerPage).join(useOldShop ? "\n" : "\n\n"),
                footer: {
                    text: `Page ${page + 1}/${stuff.clamp(Math.ceil(entries.length / itemsPerPage), 1, Infinity)}, ${stuff.venezuelaMode ? "oh no venezuela mode is enabled" : "add --page <page number> at the end to see a different page"}`
                }    
            }
            if (useOldShop) embed.title = "Shop (old version)"
            if (useOldShop) embed.color = 0x34eb86
            message.channel.send({embed: embed});
        } else {
            if (stuff.shopItems[item] != undefined) {
                var repeatAmount = stuff.clamp(amount, 1, stuff.getConfig("massBuyLimit"));
                var it = stuff.shopItems[item];
                if (it.unlisted) throw `You can't buy that item lol`
                if (it.veModeExclusive && !stuff.venezuelaMode) throw `You can only buy this item in venezuela mode`
                var embed = {
                    title: `${it.icon} ${it.name}`,
                    description: `You bought ${it.icon} ${it.name} for ${stuff.format(it.price * stuff.stonks[item].mult)} ️${(stuff.currencies[curr] || stuff.currencies.ip).icon}`
                }
                var curr = it.currency || "ip"
                var price = stuff.shopItems[item].price * stuff.stonks[item].mult;
                if (it.rarity) {
                    embed.color = it.rarity;
                }
                stuff.repeat(i => {
                    var cantAfford = stuff.getMoney(message.author.id, curr || "ip") < price;
                    if (cantAfford) {
                        throw `You can't afford this item`
                    } else {      
                        stuff.addItem(message.author.id, {name: it.name, onUse: it.onUse, icon: it.icon, id: item, extraData: {...it.extraData}, rarity: it.rarity})
                        stuff.addMoney(message.author.id, -price, curr)
                    }  
                }, repeatAmount).then(([repeat, err]) => {                    
                    embed.description = `You bought ${repeat}x ${it.icon} ${it.name} for ${stuff.format(it.price * stuff.stonks[item].mult * repeat)} ${(stuff.currencies[curr] || stuff.currencies.ip).icon}`;
                    if (err && repeat <= 0) {stuff.sendError(message.channel, err);console.log(err)}
                    else if (repeat > 0) message.channel.send({embed: embed})
                })
            } else {
                throw `the item \`${item}\` doesn't exist`
            }
        }
    }
}
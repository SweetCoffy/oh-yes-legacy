const stuff = require('../stuff')

module.exports = {
    name: "buy",
    description: "buys something from the shop",
    usage: "buy <item>",
    cooldown: 10,

    execute(message, args, extraArgs, _extraArgsObject, discount = 1) {
        var item = args[0];


        if (!item) {
            var entries = Object.entries(stuff.shopItems).sort(function(a, b) {
                return b[1].price - a[1].price;
            }).filter(el => {
                return !el[1].unlisted
            })
            var itemNames = []
            var page = (parseInt(extraArgs[0]) || 1) - 1;
            var startFrom = 0 + (10 * page);

            entries.forEach(entry => {
                itemNames.push(`${entry[1].icon} \`${entry[0]}\` **${entry[1].name}** ─ <:ip:763937198764326963> __${stuff.format(entry[1].price)}__ ${(discount < 1) ? `${(1 - discount) * 100}% OFF` : ``}${(entry[1].type) ? ` ─ ${entry[1].type}` : ``}${(entry[1].extraInfo) ? `\n${entry[1].extraInfo}` : ``}`);
            })

            var embed = {
                title: "shop items",
                description: itemNames.slice(startFrom, startFrom + 10).join("\n\n"),

                footer: {
                    text: `page ${page + 1}/${stuff.clamp(Math.ceil(entries.length / 10), 1, Infinity)}, add --<page number> at the end to see a different page`
                }
                
            }

            message.channel.send({embed: embed});
        } else {
            if (stuff.shopItems[item] != undefined) {

                var repeatAmount = stuff.clamp(parseInt(args[1]) || 1, 1, 250);
                var it = stuff.shopItems[item];
                if (it.unlisted) throw `You can't buy that item lol`
                var embed = {
                    title: `${it.icon} ${it.name}`,
                    description: `You bought ${it.icon} ${it.name} for ${stuff.format(it.price * discount)} Internet Points\™️`
                }
                
                
                stuff.repeat(i => {
                    if (stuff.shopItems[item].inStock > 0) {
    
                        if (stuff.getPoints(message.author.id) < stuff.shopItems[item].price * discount) {
                            throw `you need ${((stuff.shopItems[item].price * discount) - stuff.getPoints(message.author.id)).toFixed(1)} more <:ip:763937198764326963> to buy this item!`
                        } else {      
                            
                            
                            stuff.addItem(message.author.id, {name: it.name, onUse: it.onUse, icon: it.icon, id: item, extraData: it.extraData, rarity: it.rarity})
                            stuff.addPoints(message.author.id, -it.price * discount)
        
                            
                            if (it.rarity) {
                                embed.color = it.rarity;
                            }
                            stuff.shopItems[item].inStock -= 1;
                        }
                        
                        
                    } else {
                        throw "that item isn't in stock anymore lolololo"
                    }
                }, repeatAmount).then(repeat => {                    
                    embed.description = `You bought ${repeat} ${it.icon} ${it.name} for ${stuff.format(it.price * discount * repeat)} <:ip:763937198764326963>`;
                    message.channel.send({embed: embed})
                })

                

            } else {
                throw `the item \`${item}\` doesn't exist`
            }
        }
    }
}
const stuff = require('../stuff')

module.exports = {
    name: "buy",
    description: "buys something from the shop",
    usage: "buy <item>",

    execute(message, args) {
        var item = args[0];


        if (!item) {
            var entries = Object.entries(stuff.shopItems);
            var itemNames = []

            entries.forEach(entry => {
                itemNames.push(`${entry[1].icon} \`${entry[0]}\`: ${entry[1].name}, ${entry[1].price} Internet Points\™️`);
            })

            var embed = {
                title: "shop items",
                description: itemNames.join("\n"),

                footer: {
                    text: "use ;buy <item name> to buy an item"
                }
                
            }

            message.channel.send({embed: embed});
        } else {
            if (stuff.shopItems[item] != undefined) {

                if (stuff.shopItems[item].inStock > 1) {

                    if (stuff.getPoints(message.author.id) < stuff.shopItems[item].price) {
                        throw `you need ${(stuff.shopItems[item].price - stuff.getPoints(message.author.id)).toFixed(1)} more Internet Points\™️ to buy this item!`
                    } else {      
                        var it = stuff.shopItems[item];
                        
                        stuff.addItem(message.author.id, {name: it.name, onUse: it.onUse, icon: it.icon, id: item, extraData: it.extraData})
                        stuff.addPoints(message.author.id, -it.price)
    
                        var embed = {
                            title: `${it.icon} ${it.name}`,
                            description: `You bought ${it.icon} ${it.name} for ${it.price} Internet Points\™️`
                        }
                        message.channel.send({embed: embed});
                        stuff.shopItems[item].inStock -= 1;
                    }
                    

                } else {
                    throw "that item isn't in stock anymore lolololo"
                }

            } else {
                throw `the item \`${item}\` doesn't exist`
            }
        }
    }
}
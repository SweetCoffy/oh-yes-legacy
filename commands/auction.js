const stuff = require("../stuff")

if (!stuff.auction) stuff.auction = {
    items: {

    },
    last: 0,
}

module.exports = {
    name: "auction",
    aliases: ["a", "ah"],
    category: "economy",
    async execute(msg, args, _, { filter }) {
        function parseFilter(str) {
            var h = str.split(";").map(el => el.trim()).filter(el => el)


        }
        var g = args.shift()
        if (g == "list") {
            var it = Object.keys(stuff.auction.items)
            var embed = {
                title: `moment`,
            }
            var page = 0
            var pageSize = 20
            function updat() {
                embed.description = `${it.slice(page * pageSize, (page * pageSize) + pageSize).map(id => {
                    var el = stuff.auction.items[id]
                    return `\`${id}\` <@${el.user}> ${el.title} - ${stuff.format(el.price)} ${stuff._currencies[el.currency].icon} (${el.item.icon} ${el.item.name} \`${el.item.id}\`)`
                }).join("\n") || "empty af"}`
            }
            updat()

            await msg.reply({ embeds: [embed] })

        } else if (g == "sell") {
            var itname = args.shift()
            var it = stuff.conversions.inventoryItem(itname, msg)
            if (it < 0) throw `epic fail tbh`
            var e = stuff.db.data[msg.author.id].inventory.splice(it, 1)[0]
            var id = ((stuff.auction.last++) + "").padStart(6, "0")
            var price = stuff.conversions.formattedNumber(args.shift())
            var curr = args.shift() || "ip"
            if (!stuff._currencies[curr]) throw `smh smh smh`
            var a = stuff.auction.items[id] = {
                title: args.shift() || "epic placeholder",
                user: msg.author.id,
                item: e,
                id,
                listedAt: Date.now(),
                price: price,
                currency: curr,
            }
            await msg.reply(`Sucessfully put the item for sale, id is \`${id}\``)
        } else if (g == "buy" || g == "remove") {
            var id = (args.shift() + "").padStart(6, "0")
            console.log(id)
            var it = stuff.auction.items[id]
            if (!it) throw `unknown item`
            if (it.user == msg.author.id) {
                stuff.db.data[msg.author.id].inventory.push(it.item)
                delete stuff.auction.items[id]
                await msg.reply(`Remoov'd the item`)
            } else {
                if (stuff.getMoney(msg.author.id, it.currency) < it.price) throw `not enough money`
                stuff.addMoney(msg.author.id, -it.price, it.currency)
                stuff.addMoney(it.user, it.price, it.currency)
                stuff.db.data[msg.author.id].inventory.push(it.item)
                await msg.reply(`Bought the item`)
                delete stuff.auction.items[id]
            }
        } else {
            throw `tf do you mean by "${g}"`
        }
    }
}
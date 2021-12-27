const stuff = require("../stuff")

module.exports = {
    name: "helditem",
    aliases: ["pvpitem"],
    useArgsObject: true,
    arguments: [
        {
            type: "string",
            name: "bruv",
            optional: true,
            default: "no"
        },
        {
            type: "string",
            name: "item",
            optional: true,
            default: "-",
        },
        {
            type: "string",
            name: "swapitem",
            optional: true,
            default: "-",
        },
    ],
    async execute(msg, args) {
        var it = args.item
        var swapit = args.swapitem
        var a = args.bruv
        var items = stuff.getHeld(msg.author.id)
        if (a == "add") {
            var i = stuff.shopItems[it]
            var pvpi = stuff.pvpItems[it]
            if (!i) throw `${it} Doesn't exist`
            if (!pvpi) throw `${i.name} Can't be used in PvP!`
            if (items.length >= 4) throw `You can't add more items!`
            if (items.some(el => el.id == it)) throw `You can't have duplicate items!`
            items.push({
                id: it,
            })
        } else if (a == "remove") {
            var i = items.findIndex(el => el.id == it)
            if (i == -1) throw `Bruh`
            items.splice(i, 1)
        } else if (a == "move") {
            var i1 = items.findIndex(el => el.id == it)
            var i2 = items.findIndex(el => el.id == swapit)
            if (i1 == -1 || i2 == -1) throw `fuck you`
            var epic = items[i1]
            items[i1] = items[i2]
            items[i2] = epic
        }
        await msg.reply(`Items:\n${items.map(el => {
            var i = stuff.shopItems[el.id]
            var pvpi = stuff.pvpItems[el.id]
            return `${(!pvpi) ? "🚫" : ""}${i.icon} ${i.name}`
        }).join("\n") || "Nothing"}`)
    }
}
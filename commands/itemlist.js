const stuff = require("../stuff")

module.exports = {
    name: "itemlist",
    async execute(msg, _no, _u, h) {
        await msg.channel.send({
            embeds: [{
                title: "Item list moment",
                description: `${Object.keys(stuff.shopItems).filter(el => {
                    if (h.pvp) return stuff.pvpItems[el]
                    return true
                }).map(el => `${stuff.itemP(el)}`).join("\n") || "what how"}`
            }]
        })
    }
}
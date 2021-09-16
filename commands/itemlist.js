const stuff = require("../stuff")

module.exports = {
    name: "itemlist",
    async execute(msg) {
        await msg.channel.send({
            embeds: [{
                title: "Item list moment",
                description: `${Object.keys(stuff.shopItems).map(el => `${stuff.itemP(el)}`).join("\n") || "what how"}`
            }]
        })
    }
}
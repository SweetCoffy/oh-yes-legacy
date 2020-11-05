const stuff = require("../stuff")

module.exports = {
    name: "ores",
    execute (message) {
        var items = Object.values(stuff.mineables).map(el => `${stuff.shopItems[el.id].icon} **${stuff.shopItems[el.id].name}**\n${el.chance * 100}% Spawn rate ─ ${el.minAmount}-${el.maxAmount} Spawn amount ─ ^${el.miningPower} Mining power required`);
        var embed = {
            title: "Ore list",
            color: 0x34c9eb,
            description: items.join("\n\n")
        }
        message.channel.send({embed: embed});
    }
}
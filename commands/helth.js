const stuff = require("../stuff")

module.exports = {
    name: "helth",
    description: "shows your current health",
    execute(message) {
        var hp = stuff.userHealth[message.author.id];
        message.channel.send({
            embed: {
                title: message.author.username,
                color: 0x34d5eb,
                description: `**Health**: ${"▮".repeat(stuff.clamp((hp / stuff.getMaxHealth(message.author.id)) * 20, 0, 200))}${"▯".repeat(stuff.clamp((1 - (hp / stuff.getMaxHealth(message.author.id))) * 20, 0, Infinity))} ${stuff.format(hp)}/${stuff.format(stuff.getMaxHealth(message.author.id))}`
            }
        })
    }
}
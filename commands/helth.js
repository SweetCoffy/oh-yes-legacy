const stuff = require("../stuff")

module.exports = {
    name: "helth",
    description: "shows your current health",
    execute(message) {
        var hp = stuff.userHealth[message.author.id];
        message.channel.send({
            embed: {
                description: `${message.author}\n${"▮".repeat(stuff.clamp(hp / 20, 0, 200))}${"▯".repeat(stuff.clamp((stuff.getMaxHealth(message.author.id) - hp) / 20, 0, Infinity))} ${stuff.format(hp)}/${stuff.format(stuff.getMaxHealth(message.author.id))}`
            }
        })
    }
}
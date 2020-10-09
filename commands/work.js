const stuff = require("../stuff")

module.exports = {
    name: "work",
    description: "do work and earn moni!!11!1",
    cooldown: 15,
    execute (message) {
        var things = [
            {
                message: "You did the cat and lost Internet Points\™️",
                amount: -50,
            },
            {
                message: "You got free Internet Points\™️ from someone... h",
                amount: 100,
            },
            {
                message: "You gave eggs to the Sky Egg Lord and got Internet Points\™ in exchange",
                amount: 300,
            }
        ]

        
        var thing = stuff.randomArrayElement(things);
        var amount = thing.amount * Math.random();
        var embed = {
            title: "stonks",
            color: 0x40ff60,
            description: thing.message,
            footer: {
                text: `earned ${stuff.format(amount)} Internet Points\™️`
            }
        }
        if (amount < 0.1) {
            embed.title = "not stonks"
            embed.color = 0xff4040;
            embed.footer.text = `lost ${stuff.format(-amount)} Internet Points\™️`
        }
        stuff.addPoints(message.author.id, amount);
        message.channel.send({embed: embed});
    }
}
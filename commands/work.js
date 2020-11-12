const stuff = require("../stuff")

module.exports = {
    name: "work",
    description: "do work and earn moni!!11!1",
    cooldown: 7.5,
    execute (message) {
        var things = [
            {
                message: "You did the cat and lost Internet Points\™️",
                amount: -10,
            },
            {
                message: "You got free Internet Points\™️ from someone... h",
                amount: 700,
            },
            {
                message: "You sold your eggs to some questionable company",
                amount: 10000,
            },
            {
                message: "You gave eggs to the Sky Egg Lord and got Internet Points\™ in exchange",
                amount: 1000,
            },
            {
                message: "You moved to venezuela",
                amount: -10000,
            },
        ]

        
        var thing = stuff.randomArrayElement(things);
        var amount = thing.amount * Math.random();
        if (amount > 0) {
            amount *= stuff.clamp(stuff.getMultiplier(message.author.id, false) * Math.random(), 1, Infinity)
        }
        var embed = {
            title: "stonks",
            color: 0x40ff60,
            description: thing.message,
            footer: {
                text: `earned ${stuff.format(amount)} Internet Points\™️`
            }
        }
        if (amount < 0) {
            embed.title = "not stonks"
            embed.color = 0xff4040;
            embed.footer.text = `lost ${stuff.format(-amount)} Internet Points\™️`
        } 
        
        stuff.addPoints(message.author.id, amount);
        message.channel.send({embed: embed});
    }
}
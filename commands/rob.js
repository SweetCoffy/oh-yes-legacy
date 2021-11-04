const stuff = require("../stuff");

module.exports = {
    name: "rob",
    aliases: ["steal"],
    useArgsObject: true,
    arguments: [
        {
            name: "user",
            type: "user",
        }
    ],
    async execute(msg, { user }) {
        if (user.id == msg.author.id) throw `why are you trying to rob yourself you fucktard`
        var p = 0.01
        var a = [
            0.25,
            0.5,
            0.75,
            0.9,
            1
        ]
        function lerp(a, b, x) {
            return (a * x) + (b * (1 - x))
        }
        for (var p_ of a) {
            p = lerp(p, p_, Math.random())
            if (Math.random() < 0.5) break
        }
        var amt = BigInt(Math.floor(Number(stuff.getMoney(user.id)) * p))

        var the = (Number(stuff.getMoney(user.id)) / Number(stuff.getMoney(msg.author.id))) - 0.5

        var spdDif = stuff.getSpeed(msg.author.id) - stuff.getSpeed(user.id);

        var successRate = Math.min((0.5 - (p / 4)) + (spdDif / 75) + Math.min((the / 1.5), 0.8), 0.9)

        if (Math.random() > successRate) {
            var lostP = p / 1.3
            var lostAmt = stuff.getMoney(msg.author.id) / BigInt(Math.floor(1 / lostP))
            stuff.addMoney(msg.author.id, Number(-lostAmt))
            stuff.addMoney(user.id, Number(lostAmt))
            await msg.reply(`You epically failed to steal money and paid ${stuff.format(lostAmt)} to ${user.username}${(lostP > 0.5) ? ", This will drastically affect the fishing season" : ""}, success rate was ${(successRate * 100).toFixed(1)}% btw`)
            return;
        }
        stuff.addMoney(user.id, Number(-amt))
        stuff.addMoney(msg.author.id, Number(amt))
        await msg.reply(`You stole ${stuff.format(amt)}! (${(p * 100).toFixed(1)}%), success rate was ${(successRate * 100).toFixed(1)}% btw`)
    }
}
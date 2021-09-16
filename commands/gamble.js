var stuff = require('../stuff')
module.exports = {
    name: "gamble",
    description: "Out of all the other ways you could make money, you decided to gamble",
    useArgsObject: true,
    arguments: [
        {
            name: "amount",
            type: "formattedNumber"
        },
    ],
    execute(message, { amount }, _h, { debug, currency: curr }) {
        curr = curr || "ip"
        var m = stuff.getMoney(message.author.id, curr)
        console.log(curr)
        if (m < amount) throw `You don't have enough money`
        var a = Number(amount) / Number(m)
        var chance = 0.6 + (Math.sin(Date.now() / 100) * 0.1) + (a * 0.25)
        stuff.addMoney(message.author.id, -amount, curr)
        if (debug) {
            message.channel.send(`Chance: ${chance}`)
        }
        if (Math.random() < chance) {
            var oldA = amount
            var bonus = Math.ceil(amount * (a * 0.25))
            amount += bonus
            stuff.addMoney(message.author.id, amount * 2, curr)
            message.channel.send(`You got ${stuff.currencies[curr].icon} ${stuff.format(oldA)} (+${stuff.format(bonus)} Life savings bonus) <:oO:749319330503852084>`)
        } else {
            message.channel.send(`You lost ${stuff.currencies[curr].icon} ${stuff.format(amount)} <:_v:823258737451073556>`)
        }
    }
}
const stuff = require("../stuff")

module.exports = {
    name: "slotmachine",
    description: 'oh no',
    execute(message) {
        var moni = stuff.getPoints(message.author.id)
        var amount = 1000 * stuff.getMultiplier(message.author.id, false)
        if (moni < amount) throw `You need at least ${stuff.format(amount)} Internet Points to do this`
        var possibleStuff = ['<:oO:749319330503852084>','<:eggs:744607071244124230>','<:keanu:769710477944291338>', '<:madfunny:767116516025565214>', '<:madv_:770746277192663042>', '<:eggv_:766470102723330109>', '<:soulstarev_:770829181339697172>']
        var _thing = [stuff.randomArrayElement(possibleStuff), stuff.randomArrayElement(possibleStuff), stuff.randomArrayElement(possibleStuff), stuff.randomArrayElement(possibleStuff)]
        var thing = [...new Set(_thing)]
        var moneyEarned = 0
        if (thing.length > 3) moneyEarned = -amount
        if (thing.length == 3) moneyEarned = amount * 0.1
        if (thing.length == 2) moneyEarned = amount
        if (thing.length == 1) moneyEarned = amount * 10
        
        stuff.addPoints(message.author.id, moneyEarned);
        var embed = {
            color: 0x0398fc,
            title: "totally not gambling",
            description: _thing.join(" "),
            footer: { text: `${(moneyEarned < 0) ? `Lost ${stuff.format(-moneyEarned)}` : `Earned ${stuff.format(moneyEarned)}`} Internet Points` }
        }
        message.channel.send({embed: embed});
    }
}
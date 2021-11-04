const stuff = require("../stuff")

module.exports = {
    name: "heal",
    description: 'ha ha yes',
    category: "economy",
    cooldown: 1,
    useArgsObject: true,
    arguments: [
        {
            name: "percent",
            type: "number",
            optional: true,
            default: 1,
        }
    ],
    async execute(message, args) {
        var p = stuff.pvp[message.author.id]
        if (p) throw `You can't heal while in a pvp match!`
        var p = (args.percent / 100) || 1
        var healCount = stuff.db.getData(`/${message.author.id}/`).healCount || 0;
        var m = 1;
        m *= healCount * 0.1
        if (stuff.venezuelaMode) m *= 25000
        if (stuff.userHealth[message.author.id] < 0) stuff.userHealth[message.author.id] = 0
        var heal = Math.min((stuff.userHealth[message.author.id] + (stuff.getMaxHealth(message.author.id) * p)) - stuff.userHealth[message.author.id], stuff.getMaxHealth(message.author.id) - stuff.userHealth[message.author.id])
        var fullHealPrice = heal * 2 * (1 + healCount) * m;
        if (heal <= 0) return message.channel.send(`no`)
        if (stuff.getPoints(message.author.id) < fullHealPrice) return message.channel.send(`You can't afford healing (${stuff.format(fullHealPrice)} <:ip:770418561193607169>), how american`)
        stuff.addPoints(message.author.id, -fullHealPrice)
        stuff.userHealth[message.author.id] += heal;
        message.channel.send(`+${stuff.format(heal)} HP`)
        stuff.db.push(`/${message.author.id}/healCount`, healCount + 1)
    }
}
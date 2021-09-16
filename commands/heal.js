const stuff = require("../stuff")

module.exports = {
    name: "heal",
    description: 'ha ha yes',
    category: "economy",
    cooldown: 1,
    async execute(message) {
        var p = stuff.pvp[message.author.id]
        if (p) throw `You can't heal while in a pvp match!`
        var healCount = stuff.db.getData(`/${message.author.id}/`).healCount || 0;
        var m = 1;
        m *= healCount * 0.1
        if (stuff.venezuelaMode) m *= 25000
        var heal = stuff.getMaxHealth(message.author.id) - stuff.userHealth[message.author.id]
        var halfHealPrice = (heal / 2) * 1.9 * (1 + healCount) * m;
        var fullHealPrice = heal * 2 * (1 + healCount) * m;
        if (heal <= 0) return message.channel.send(`You don't need healing, you're already at max health`)
        if (stuff.getPoints(message.author.id) < halfHealPrice) return message.channel.send(`You can't afford any of the healing options (${stuff.format(halfHealPrice)} <:ip:770418561193607169>), how american`)
        var embed = {
            title: "Healing stuff",
            description: `️1️⃣ Full heal (<:ip:770418561193607169> ${stuff.betterFormat(fullHealPrice, stuff.formatOptions.number)}, ${(stuff.userHealth[message.author.id] + heal).toFixed()} HP)\n2️⃣ Half heal (<:ip:770418561193607169> ${stuff.betterFormat(halfHealPrice, stuff.formatOptions.number)}, ${(stuff.userHealth[message.author.id] + (heal / 2)).toFixed()} HP)`,
            footer: { text: `Heal counter: ${healCount}` }
        }
        var m = await message.channel.send({embed: embed})
        await m.react('1️⃣')
        await m.react('2️⃣')
        var c = m.createReactionCollector((r, u) => ['1️⃣', '2️⃣'].includes(r.emoji.name) && u.id == message.author.id, { limit: 1, time: 30 * 1000 })
        c.on('collect', (r, u) => {
            if (u.id != message.author.id) return
            var heal = stuff.getMaxHealth(message.author.id) - stuff.userHealth[message.author.id]
            if (r.emoji.name == '1️⃣') {
                if (stuff.getPoints(u.id) < fullHealPrice) {
                    message.channel.send(`You can't afford a full heal (${stuff.format(fullHealPrice)})`)
                } else {
                    stuff.addPoints(u.id, -fullHealPrice)
                    stuff.userHealth[u.id] += heal;
                    message.channel.send(`Successfully committed full heal`)
                    stuff.db.push(`/${message.author.id}/healCount`, healCount + 1)
                }
            } else if (r.emoji.name == '2️⃣') {
                if (stuff.getPoints(u.id) < halfHealPrice) {
                    message.channel.send(`You can't afford a half heal (${stuff.format(halfHealPrice)})`)
                } else {
                    stuff.addPoints(u.id, -halfHealPrice)
                    stuff.userHealth[u.id] += heal / 2;
                    message.channel.send(`Successfully committed half heal`)
                    stuff.db.push(`/${message.author.id}/healCount`, healCount + 0.5)
                }
            }
            c.stop()
        }).on('end', () => {
            m.delete()
        })
    }
}
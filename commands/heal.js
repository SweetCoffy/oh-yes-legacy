const stuff = require("../stuff")

module.exports = {
    name: "heal",
    description: 'ha ha yes',
    cooldown: 10,
    async execute(message) {
        var healCount = stuff.db.getData(`/${message.author.id}/`).healCount || 0;
        var heal = stuff.getMaxHealth(message.author.id) - stuff.userHealth[message.author.id]
        var halfHealPrice = (heal / 2) * 1.9 * (1 + (0.37 * healCount));
        var fullHealPrice = heal * 2 * (1 + (0.5 * healCount));
        if (heal <= 0) return message.channel.send(`You don't need healing, you're already at max health`)
        if (stuff.getPoints(message.author.id) < halfHealPrice) return message.channel.send(`You can't afford any of the healing options, how american`)
        var embed = {
            title: "Healing stuff",
            description: `️1️⃣ Full heal (<:ip:770418561193607169> ${stuff.betterFormat(heal * 2, stuff.formatOptions.number)})\n2️⃣ Half heal (<:ip:770418561193607169> ${stuff.betterFormat((heal / 2) * 1.9, stuff.formatOptions.number)})`,
            footer: { text: `Heal counter: ${healCount}` }
        }
        var m = await message.channel.send({embed: embed})
        await m.react('1️⃣')
        await m.react('2️⃣')
        var c = m.createReactionCollector((r, u) => ['1️⃣', '2️⃣'].includes(r.emoji.name), { limit: 1, time: 15 * 1000 })
        c.on('collect', (r, u) => {
            if (r.emoji.name == '1️⃣') {
                if (stuff.getPoints(u.id) < fullHealPrice) {
                    message.channel.send(`You can't afford a full heal`)
                } else {
                    stuff.addPoints(u.id, -fullHealPrice)
                    stuff.userHealth[u.id] += heal;
                    message.channel.send(`Successfully committed full heal`)
                    stuff.db.push(`/${message.author.id}/healCount`, healCount + 1)
                }
            } else if (r.emoji.name == '2️⃣') {
                if (stuff.getPoints(u.id) < halfHealPrice) {
                    message.channel.send(`You can't afford a half heal`)
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
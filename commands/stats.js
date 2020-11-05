const stuff = require('../stuff');

module.exports = {
    name: "stats",
    description: "shows a user's stats",
    usage: "stats [user]",
    execute(message, args) {
        var user = message.mentions.users.first() || message.author;

        var points = stuff.getPoints(user.id);
        var multiplier = stuff.getMultiplier(user.id);
        var totalMultiplier = stuff.getMultiplier(user.id, false);
        var userObject = stuff.db.getData(`/${user.id}/`)

        var embed = {
            title: `${user.username}'s stats`,
            color: 0x4287f5,
            description: `${stuff.getPoints(user.id).toFixed(1)} + (${stuff.getGold(user.id).toFixed(1)} * 100) + ${stuff.getMultiplierMultiplier(user.id).toFixed(1)}`,
            fields: [
                {
                    name: "Money",
                    value: `<:ip:770418561193607169> ${stuff.format(points)}️\n:coin: ${stuff.format(stuff.getGold(user.id))}`,
                },
                {
                    name: "Money Donated (Internet Points)",
                    value: `<:ip:770418561193607169> ${stuff.format(stuff.db.getData(`/${user.id}/`).donated || 0)}`,
                },
                {
                    name: "Total Multiplier",
                    value: `${stuff.format(totalMultiplier)}`,
                },

                {
                    name: "Multiplier",
                    value: `${stuff.format(multiplier)}`,
                    inline: true,
                },
                {
                    name: "Exponent",
                    value: `${stuff.format(stuff.getMultiplierMultiplier(user.id))}`,
                    inline: true,
                },
            ]
        }

        if ((stuff.db.getData(`/${user.id}/`).medals || []).length > 0) {
            embed.fields.push(                {
                name: "Medals",
                value: `${(stuff.db.getData(`/${user.id}/`).medals || []).map(el => el.icon).join(" ")}`,
                inline: true,
            })
        }
        if (stuff.getEquipment(user.id).length > 0) {
            embed.fields.push({
                name: `Equipment (${stuff.getEquipment(user.id).length}/${stuff.getEquipmentSlots(user.id)})`,
                value: `${stuff.getEquipment(user.id).map(el => el.icon).join(" ")}`,
                inline: true
            })
        }

        message.channel.send({embed: embed})
    }
}
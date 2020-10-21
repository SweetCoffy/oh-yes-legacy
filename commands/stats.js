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

        var embed = {
            title: `${user.username}'s stats`,
            fields: [
                {
                    name: "money",
                    value: `<:ip:763937198764326963> ${stuff.format(points)}️\n:coin: ${stuff.format(stuff.getGold(user.id))}`,
                },
                {
                    name: "total donated",
                    value: `<:ip:763937198764326963> ${stuff.format(stuff.db.getData(`/${user.id}/`).donated || 0)}`,
                },
                {
                    name: "total multiplier",
                    value: `${stuff.format(totalMultiplier)}`,
                },

                {
                    name: "multiplier",
                    value: `${stuff.format(multiplier)}`,
                    inline: true,
                },
                {
                    name: "exponent",
                    value: `${stuff.format(stuff.getMultiplierMultiplier(user.id))}`,
                    inline: true,
                },
                {
                    name: "health",
                    value: `${stuff.format(stuff.userHealth[user.id])}/${stuff.format(stuff.getMaxHealth(user.id))}`,
                    inline: true,
                },
                {
                    name: "defense",
                    value: `🛡️ ${stuff.format(stuff.getDefense(user.id))}`,
                    inline: true,
                },
            ]
        }

        if ((stuff.db.getData(`/${user.id}/`).medals || []).length > 0) {
            embed.fields.push(                {
                name: "medals",
                value: `${(stuff.db.getData(`/${user.id}/`).medals || []).map(el => el.icon).join(" ")}`,
                inline: true,
            })
        }
        if (stuff.getEquipment(user.id).length > 0) {
            embed.fields.push({
                name: `equipment (${stuff.getEquipment(user.id).length}/${stuff.getEquipmentSlots(user.id)})`,
                value: `${stuff.getEquipment(user.id).map(el => el.icon).join(" ")}`,
                inline: true,
            })
        }

        message.channel.send({embed: embed})
    }
}
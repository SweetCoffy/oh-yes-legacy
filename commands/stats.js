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
                    value: `<:ip:763937198764326963> ${stuff.format(points)}️`,
                },
                {
                    name: "total multiplier",
                    value: `${stuff.format(totalMultiplier)}`,
                },
                {
                    name: "total donated",
                    value: `<:ip:763937198764326963> ${stuff.format(stuff.db.getData(`/${user.id}/`).donated || 0)}`
                },

                {
                    name: "multiplier",
                    value: `${stuff.format(multiplier)}`,
                    inline: true,
                },
                {
                    name: "multiplier's multiplier",
                    value: `${stuff.format(stuff.getMultiplierMultiplier(user.id))}`,
                    inline: true,
                },
                {
                    name: "health",
                    value: `${stuff.format(stuff.userHealth[user.id])}/${stuff.format(stuff.getMaxHealth(user.id))}`,
                    inline: true,
                },
            ]
        }

        if ((stuff.db.getData(`/${user.id}/`).medals || []).length > 0) {
            embed.fields.push(                {
                name: "medals",
                value: `${(stuff.db.getData(`/${user.id}/`).medals || []).map(el => el.icon).join(" ")}`
            })
        }

        message.channel.send({embed: embed})
    }
}
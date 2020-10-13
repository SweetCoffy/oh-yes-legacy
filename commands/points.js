const stuff = require('../stuff');

module.exports = {
    name: "points",
    description: "shows your/an user's internet points:tm: (<:v_:755546914715336765>)",
    usage: "points [user]",
    execute(message, args) {
        var user = message.mentions.users.first() || message.author;

        var points = stuff.getPoints(user.id);
        var multiplier = stuff.getMultiplier(user.id);
        var totalMultiplier = stuff.getMultiplier(user.id, false);

        var embed = {
            title: `${user.username}'s stats`,
            fields: [
                {
                    name: "moni",
                    value: `<:ip:763937198764326963> ${stuff.format(points)}️`
                },
                {
                    name: "multiplier",
                    value: `${stuff.format(multiplier)}`
                },
                {
                    name: "multiplier's multiplier",
                    value: `${stuff.format(stuff.getMultiplierMultiplier(user.id))}`
                },
                {
                    name: "total multiplier",
                    value: `${stuff.format(totalMultiplier)}`,
                }
            ]
        }

        message.channel.send({embed: embed})
    }
}
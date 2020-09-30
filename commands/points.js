const stuff = require('../stuff');

module.exports = {
    name: "points",
    description: "shows your/an user's internet points:tm: (<:v_:755546914715336765>)",
    usage: "points [user]",
    execute(message, args) {
        var user = message.mentions.users.first() || message.author;

        var points = stuff.getPoints(user.id);
        var multiplier = stuff.getMultiplier(user.id);

        var embed = {
            title: `${user.username} has`,
            description: `${points.toFixed(1)} Internet Points\™️, Multiplier: ${multiplier.toFixed(1)}`
        }

        message.channel.send({embed: embed})
    }
}
const stuff = require('../stuff')
module.exports = {
    name: "v_",
    description: "shows a <:v_:755546914715336765> leaderboard",
    execute(message) {
        var users = Object.entries(stuff.db.getData('/'))
        .sort((a, b) => stuff.getVCounter(b[0]) - stuff.getVCounter(a[0]))
        .map((el, i) => `**#${i + 1}** <@${el[0]}>: ${stuff.getVCounter(el[0])} <:v_:755546914715336765>`)
        .slice(0, 10)
        var embed = {
            title: "<:v_:755546914715336765>",
            description: users.join("\n")
        }
        message.channel.send({embed: embed})
    }
}
const stuff = require('../stuff')
module.exports = {
    name: "v_",
    description: "shows a <:v_:755546914715336765> leaderboard",
    async execute(message) {
        var members = await message.guild.members.fetch()
        var totalV = 0;
        var users = Object.entries(stuff.db.getData('/'))
        .sort((a, b) => stuff.getVCounter(b[0]) - stuff.getVCounter(a[0]))
        .filter(el => {
            var h = !((members.get(el[0]) || { user: {} }).user.bot)
            if (h) totalV += el[1].vCounter || 0;
            return h;
        } )
        .map((el, i) => `**#${i + 1}** <@${el[0]}>: ${stuff.getVCounter(el[0])} <:v_:755546914715336765>`)
        .slice(0, 10)
        var embed = {
            title: "<:v_:755546914715336765> Leaderboard",
            color: 0x4287f5,
            description: users.join("\n"),
            footer: { text: `Total: ${totalV}` }
        }
        message.channel.send({embed: embed})
    }
}
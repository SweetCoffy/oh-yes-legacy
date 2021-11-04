const stuff = require('../stuff')

module.exports = {
    name: 'baltop',
    description: "shows a top 10 users who have the most moni",
    aliases: ['leaderboard'],
    category: "economy",
    execute (message, a, _e, e) {
        var client = message.client;
        var guild = message.guild;
        var entries = Object.entries(stuff.db.getData("/"))
        var sortedEntries = entries.sort((a, b) => {
            return Number(stuff.getRankValue(b[0]) - stuff.getRankValue(a[0]))
        }).filter(v => {
            if (!message.guild.members.cache.get(v[0]) && !e.everyone) return false
            return !(client.users.cache.get(v[0]) || {}).bot
        })
        if  (e.poor) sortedEntries = sortedEntries.reverse()
        var embed = {
            title: e.poor ? "Top 10 poor people" : "Top 10 rich people",
            color: 0x03adfc,
            description: sortedEntries.map((el, i) => `**#${i + 1}** <@${el[0]}> ─ ${stuff.format(stuff.getRankValue(el[0]))} Rank value\n${Object.entries(stuff.currencies).filter(([k, v]) => stuff.getMoney(el[0], k) > 0).map(([k, v]) => `${v.icon} ${stuff.format(stuff.getMoney(el[0], k))}`).join(" ")}`).slice(0, 10).join("\n\n")
        }
        message.channel.send({embed: embed});
    }
}
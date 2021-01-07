const stuff = require('../stuff')

module.exports = {
    name: 'baltop',
    description: "shows a top 10 users who have the most moni",
    aliases: ['leaderboard'],
    execute (message) {
        var client = message.client;
        var guild = message.guild;
        var entries = Object.entries(stuff.db.getData("/"))
        var sortedEntries = entries.sort((a, b) => {
            return Number(stuff.getRankValue(b[1]) - stuff.getRankValue(a[1]))
        }).filter(v => {
            return !(client.users.cache.get(v[0]) || {}).bot
        })
        var embed = {
            title: "Leaderboards",
            color: 0x03adfc,
            description: sortedEntries.map((el, i) => `**#${i + 1}** <@${el[0]}> ─ ${stuff.format(el[1].points)}️ <:ip:770418561193607169> | ${stuff.format(el[1].gold || 0)}️ :coin: ─ ${stuff.format(stuff.getRankValue(el[1]))} Rank value`).slice(0, 10).join("\n")
        }
        message.channel.send({embed: embed});
    }
}
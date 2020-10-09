const stuff = require('../stuff')

module.exports = {
    name: 'baltop',
    description: "shows a top 10 users who have the most moni",
    execute (message) {
        var client = message.client;
        var guild = message.guild;
        var entries = Object.entries(stuff.db.getData("/"))
        var sortedEntries = entries.sort((a, b) => {
            return b[1].points - a[1].points
        }).filter(v => {
            return !(client.users.cache.get(v[0]) || {}).bot
        })

        var entryNames = [];
        var i = 0;
        sortedEntries.forEach(el => {
            entryNames.push(`**${i + 1}.** <@${el[0]}>, ${stuff.format(el[1].points)} Internet Points\™️, ${stuff.format(el[1].multiplier)} Multiplier`)
            i++
        });

        var embed = {
            title: "top 10 users",
            description: entryNames.slice(0, 10).join("\n")
        }
        message.channel.send({embed: embed});
    }
}
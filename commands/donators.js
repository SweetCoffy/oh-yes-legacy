const stuff = require('../stuff')

module.exports = {
    name: 'donators',
    description: "shows a top 10 users who donated the most points",
    category: "economy",
    execute (message) {
        var client = message.client;
        var guild = message.guild;
        var entries = Object.entries(stuff.db.getData("/"))
        var sortedEntries = entries.sort((a, b) => {
            return (b[1].donated || 0) - (a[1].donated || 0)
        })

        var entryNames = [];
        var i = 0;
        sortedEntries.forEach(el => {
            entryNames.push(`#**${i + 1}** <@${el[0]}> ─ Donated ${stuff.format(el[1].donated || 0)} <:ip:770418561193607169>`)
            i++
        });

        var embed = {
            title: "top 10 donators",
            color: 0x03adfc,
            description: entryNames.slice(0, 10).join("\n")
        }
        message.channel.send({embed: embed});
    }
}
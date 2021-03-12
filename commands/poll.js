const { Message } = require("discord.js")

module.exports = {
    name: "poll",
    description: "Does a poll",
    arguments: [
        {
            name: "name",
            type: "string",
        },
        {
            name: "options",
            type: "stringArray"
        }
    ],
    supportsQuoteArgs: true,
    useArgsObject: true,
    /**
     * 
     * @param { Message } message 
     * @param { Object } args 
     */
    async execute(message, args) {
        var o = args.options.slice(0, 10)
        var n = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟']
        var voted = []
        var votes = []
        var canVote = true;
        var optionsVoted = {}
        var embed = {
            title: `Poll`,
            description: args.name,
            fields: [
                {
                    name: "Options",
                    value: `${o.map((el, i) => `${n[i]} ${el} ─ 0 Votes`).join("\n")}`
                }
            ]
        }
        var msg = await message.channel.send({embed: embed})
        for (var i = 0; i < o.length; i++) {
            votes[i] = 0;
            await msg.react(n[i]);
        }
        await msg.react('🚫')
        var col = msg.createReactionCollector((r, u) => (r.emoji.name != '🚫' && !voted.includes(u.id) && !u.bot && n.includes(r.emoji.name)) || (r.emoji.name == '🚫' && u.id == message.author.id), { time: 15000 * 60 })
        col.on('collect', (r, u) => {
            if (r.emoji.name == '🚫' && u.id == message.author.id) {
                canVote = false;
                embed.footer = { text: `Vote ended` }
                msg.edit({embed: embed})
                msg.reactions.removeAll()
                r.users.remove(u.id)
            } else {
                if (!canVote) return;
                console.log(r.emoji.name)
                voted.push(u.id)
                optionsVoted[u.id] = n.indexOf(r.emoji.name);
                votes[n.indexOf(r.emoji.name)]++
                embed.fields[0] = {
                    name: "Options",
                    value: `${o.map((el, i) => `${n[i]} ${el} ─ ${votes[i]} Votes`).join("\n")}`,
                }
                embed.fields[1] = {
                    name: "Recent votes",
                    value: `${voted.map(el => `<@${el}>: ${n[optionsVoted[el]]} ${o[optionsVoted[el]]}`).reverse().slice(0, 10).join('\n')}`,
                }
                r.users.remove(u.id)
                msg.edit({embed: embed})
            }
        }).on('end', () => {
            embed.footer = { text: `Vote ended` }
            msg.reactions.removeAll()
            msg.edit({embed: embed})
        })
    }
}
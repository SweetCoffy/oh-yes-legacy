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
        var o = args.options.slice(0, 9)
        // 🟩 🟪 ⬜ 🟧 ⬛ 🟦 🟥 🟨 🟫
        var n = ['🟩', '🟪', '⬜', '🟧', '⬛', '🟦', '🟥', '🟨', '🟫']
        var voted = []
        var votes = []
        var totalVotes = 0;
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
            if (r.emoji.name == '🚫') {
                if (optionsVoted[u.id]) {
                    votes[optionsVoted[u.id]]--;
                    totalVotes--;
                    optionsVoted[u.id] = undefined;
                    voted.splice(voted.indexOf(u.id), 1)
                    embed.fields[0] = {
                        name: "Options",
                        value: `${o.map((el, i) => `${n[i]} ${el} ─ ${votes[i]} Votes (${(votes[i] / totalVotes * 100).toFixed(1)}%)`).join("\n")}\nTotal votes: ${totalVotes}\n${n.map((el, i) => `${el.repeat(Math.floor((votes[i] || 0) / totalVotes * 20))}`).join("")}`,
                    }
                    embed.fields[1] = {
                        name: "Recent votes",
                        value: `${voted.map(el => `<@${el}> ${n[optionsVoted[el]]}`).reverse().slice(0, 10).join('\n')}`,
                    }
                    r.users.remove(u.id)
                    msg.edit({embed: embed})
                }
            } else {
                if (!canVote) return;
                totalVotes++
                console.log(r.emoji.name)
                voted.push(u.id)
                optionsVoted[u.id] = n.indexOf(r.emoji.name);
                votes[n.indexOf(r.emoji.name)]++
                embed.fields[0] = {
                    name: "Options",
                    value: `${o.map((el, i) => `${n[i]} ${el} ─ ${votes[i]} Votes (${(votes[i] / totalVotes * 100).toFixed(1)}%)`).join("\n")}\nTotal votes: ${totalVotes}\n${n.map((el, i) => `${el.repeat(Math.floor((votes[i] || 0) / totalVotes * 20))}`).join("")}`,
                }
                embed.fields[1] = {
                    name: "Recent votes",
                    value: `${voted.map(el => `<@${el}> ${n[optionsVoted[el]]}`).reverse().slice(0, 10).join('\n')}`,
                }
                r.users.remove(u.id)
                msg.edit({embed: embed})
            }
            r.users.remove(u.id)
        }).on('end', () => {
            embed.footer = { text: `Vote ended` }
            msg.reactions.removeAll()
            msg.edit({embed: embed})
        })
    }
}
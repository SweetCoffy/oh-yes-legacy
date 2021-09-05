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
        function no(width, height, ar) {
            return ar;
            var i = 0;
            var str = "";
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    str += ar[x + (y * width)];
                    console.log(`${x}, ${y}`)
                    i++;
                }
                str += "\n"
            }
            console.log(str);
            return str;
        }
        var o = args.options.slice(0, 9)
        // 🟩 🟪 ⬜ 🟧 ⬛ 🟦 🟥 🟨 🟫
        var n = ['🟩','🟥','🟧','🟪', '⬜','⬛','🟦','🟨','🟫']
        var c = {
            '🟩': [0x00, 0xFF, 0x00],
            '🟥': [0xFF, 0x00, 0x00],
            '🟧': [0xFF, 0x50, 0x00],
            '🟪': [0xFF, 0x00, 0xFF],
            '⬜': [0xFF, 0xFF, 0xFF],
            '⬛': [0x69, 0x69, 0x69],
            '🟦': [0x22, 0x22, 0xFF],
            '🟨': [0xFF, 0xFF, 0x00],
            '🟫': [0xad, 0x64, 0x2f],
        }
        var voted = []
        var votes = []
        var totalVotes = 0;
        var w = 4;
        var h = 4;
        var s = w * h;
        var canVote = true;
        var optionsVoted = {}
        var embed = {
            title: `Poll`,
            description: args.name,
            fields: [
                {
                    name: "Options",
                    value: `${o.map((el, i) => `${n[i]} ${el} ─ 0 Votes`).join("\n")}`
                },
            ]
        }
        var msg = await message.channel.send({embed: embed})
        var col = msg.createReactionCollector((r, u) => !u.bot && [...n, '🚫'].includes(r.emoji.name), { time: 15000 * 60 })
        col.on('collect', (r, u) => {
            r.users.remove(u.id)
            if (r.emoji.name == '🚫') {
                console.log(optionsVoted[u.id])
                if (optionsVoted[u.id] != undefined) {
                    console.log('yes')
                    votes[optionsVoted[u.id]]--;
                    totalVotes--;
                    delete optionsVoted[u.id];
                    voted.splice(voted.indexOf(u.id), 1)
                    embed.description = `${args.name}\n\`\`\`\n${no(w, h, n.map((el, i) => `${el.repeat(Math.floor((votes[i] || 0) / totalVotes * s))}`).join(""))}\n\`\`\``
                    embed.fields[0] = {
                        name: "Options",
                        value: `${o.map((el, i) => `${n[i]} ${el} ─ ${votes[i]} Votes (${(votes[i] / totalVotes * 100).toFixed(1)}%)`).join("\n")}\nTotal votes: ${totalVotes}`,
                    }
                    embed.fields[1] = {
                        name: "Recent votes",
                        value: `${voted.map(el => `<@${el}> ${n[optionsVoted[el]]}`).reverse().slice(0, 10).join('\n')}` || `empty lol`,
                    }
                    msg.edit({embed: embed})
                }
            } else if (optionsVoted[u.id] == undefined) {
                if (!canVote) return;
                if (n.indexOf(r.emoji.name) > o.length - 1) return;
                totalVotes++
                console.log(r.emoji.name)
                voted.push(u.id)
                optionsVoted[u.id] = n.indexOf(r.emoji.name);
                votes[n.indexOf(r.emoji.name)]++
                embed.description = `${args.name}\n\`\`\`\n${no(w, h, n.map((el, i) => `${el.repeat(Math.floor((votes[i] || 0) / totalVotes * s))}`).join(""))}\n\`\`\``
                embed.fields[0] = {
                    name: "Options",
                    value: `${o.map((el, i) => `${n[i]} ${el} ─ ${votes[i]} Votes (${(votes[i] / totalVotes * 100).toFixed(1)}%)`).join("\n")}\nTotal votes: ${totalVotes}`,
                }
                embed.fields[1] = {
                    name: "Recent votes",
                    value: `${voted.map(el => `<@${el}> ${n[optionsVoted[el]]}`).reverse().slice(0, 10).join('\n')}`,
                }
                r.users.remove(u.id)
                msg.edit({embed: embed})
            }
        }).on('end', () => {
            embed.footer = { text: `Vote ended` }
            msg.reactions.removeAll()
            msg.edit({embed: embed})
        })
        for (var i = 0; i < o.length; i++) {
            votes[i] = 0;
            await msg.react(n[i]);
        }
        await msg.react('🚫')
    }
}
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
        var col = msg.createReactionCollector((r, u) => !voted.includes(u.id) && !u.bot && n.includes(r.emoji.name), { time: 15000 * 60 })
        col.on('collect', (r, u) => {
            console.log(r.emoji.name)
            voted.push(u.id)
            votes[n.indexOf(r.emoji.name)]++
            embed.fields[0] = {
                name: "Options",
                value: `${o.map((el, i) => `${n[i]} ${el} ─ ${votes[i]} Votes`).join("\n")}`
            }
            msg.edit({embed: embed})
        })
    }
}
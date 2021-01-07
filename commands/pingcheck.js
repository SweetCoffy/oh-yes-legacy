const { Message } = require('discord.js')
const stuff = require('../stuff')
module.exports = {
    name: "pingcheck",
    useArgsObject: true,
    description: "Pingspam in a nutshell",
    arguments: [
        {
            type: "user",
            name: "user",
            description: "The user to pingcheck"
        },
        {
            type: 'positiveInt',
            name: 'duration',
            description: "The duration of the pingcheck (can't be higher than 30)",
            default: 5,
            optional: true,
        },
        {
            type: 'positiveInt',
            name: 'pings',
            description: "The amount of pings (can't be higher than the duration multiplied by 2)",
            default: 5,
            optional: true,
        },
    ],
    cooldown: 120,
    /**
     * @param { Message } message 
     */
    async execute(message, args) {
        var ranks = [
            {
                letter: "E",
                points: 000,
            },
            {
                letter: "D",
                points: 1000,
            },
            {
                letter: "C",
                points: 25000,
            },
            {
                letter: "B",
                points: 50000,
            },
            {
                letter: "A",
                points: 75000,
            },
            {
                letter: "S",
                points: 90000,
            },
            {
                letter: "H",
                points: 100000,
            },
            {
                letter: "H+",
                points: 150000,
            },
            {
                letter: "How",
                points: 100000000000,
            },
        ]
        try {
            if (args.pings > args.duration * 2) throw "e"
            if (args.duration > 20) throw 'e'
            var oldNow = Date.now();
            await message.channel.send(`Send ${Math.ceil(args.pings / 2)} messages containing "h" within the ${(args.duration * 3.5).toFixed(1)} second time limit`)
            var messages = await message.channel.awaitMessages(m => m.content.toLowerCase() == "h" && m.author.id == message.author.id, { max: args.pings / 2, time: args.duration * 3.5 * 1000})
            var now = Date.now();
            var completionTime = (now - oldNow) / 1000;
            var completionTimeMs = (completionTime - Math.floor(completionTime)) * 1000;
            var timeBonus = stuff.clamp(Math.round((2000000 - ((completionTime / (args.duration * 3.5)) * 2000000)) / 100) * 100, 0, 2000000)
            var messageBonus = messages.size * 1000;
            var points = timeBonus + messageBonus;
            var interval = args.duration / (messages.size * 2)
            var percentage = 0;
            var i = 0;
            var rank = "D";
            var rankIndex = 0;
            ranks.forEach((el, i) => {
                if (points >= el.points) {rank = el.letter; rankIndex = i}
            })
            await message.channel.bulkDelete(messages)
            await message.channel.send({ embed: {
                title: `${message.member.displayName} committed pingcheck`,
                description: `**Messages**: ${messages.size}/${Math.ceil(args.pings / 2)}\n**Completion Time**: **${Math.floor(completionTime)}**s **${Math.round(completionTimeMs)}**ms\n**Pings**: ${(messages.size * 2)}/${args.pings}\n\n**Time bonus** ${timeBonus.toString().padStart(9, "0")}\n**Message bonus** ${messageBonus.toString().padStart(9, "0")}\n\n**Total** ${points.toString().padStart(9, "0")}\n**${rank}** Rank\n${ranks.map((el, i) => `${(i == rankIndex) ? `**${el.letter}**` : `${el.letter}`}`).join(" ")}\n${ranks[rankIndex + 1] ? `${ranks[rankIndex + 1].points - points} more for **${ranks[rankIndex + 1].letter}**` : ""}`,
                footer: { text: `why am i even doing this` }
            } })
            stuff.addPoints(message.author.id, points, `Pingcheck'd ${args.user}`)
            stuff.addPoints(args.user.id, points / 2, `Got pingcheck'd`)
            message.channel.send(`${args.user} Starting pingcheck...`)
            var h = setInterval(() => {
                i++;
                message.channel.send(`${args.user} ${percentage.toFixed(1)}%`)
                percentage = (i / (messages.size * 2)) * 100
                if (i > messages.size * 2) {
                    clearInterval(h)
                    message.channel.send(`${args.user} Pingcheck complete`)
                }
            }, interval)

        } catch (err) {
            stuff.sendError(message.channel, err)
        }
    }
}
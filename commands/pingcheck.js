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
            name: 'pings',
            description: "The amount of pings (can't be higher than 60)",
            default: 5,
            optional: true,
        },
    ],
    cooldown: 120,
    /**
     * @param { Message } message 
     */
    async execute(message, args, _a, a) {
        var ranks = [
            {
                letter: "E",
                points: 000,
            },
            {
                letter: "D",
                points: 2000,
            },
            {
                letter: "C",
                points: 30000,
            },
            {
                letter: "B",
                points: 60000,
            },
            {
                letter: "A",
                points: 85000,
            },
            {
                letter: "S",
                points: 150000,
            },
            {
                letter: "H",
                points: 200000,
            },
            {
                letter: "H+",
                points: 500000,
            },
            {
                letter: "How",
                points: 100000000000000000000000,
            },
        ]
        try {
            var unfunFact = ``
            if (a.ignoreLimit && !stuff.getPermission(message.author.id, "commands.pingcheck.ignoreLimit", message.guild.id)) unfunFact += `--ignoreLimit will have no effect if you don't have the \`commands.pingcheck.ignoreLimit\` permission\n`
            if (a.noH && !stuff.getPermission(message.author.id, "commands.pingcheck.noH", message.guild.id)) unfunFact += `--noH will have no effect if you don't have the \`commands.pingcheck.noH\` permission\n`
            var h = a.ignoreLimit && stuff.getPermission(message.author.id, "commands.pingcheck.ignoreLimit", message.guild.id)
            if (unfunFact.length > 0) await message.channel.send(`Unfun fact(s): ${unfunFact}`)
            if (args.pings > 60 && !h) args.pings = 60;
            if (isNaN(args.pings)) args.pings = 5;
            var oldNow = Date.now();
            var hh = a.noH && stuff.getPermission(message.author.id, "commands.pingcheck.noH", message.guild.id)
            var percentage = 0;
            var messages;
            if (!hh) {
                messages = await message.channel.awaitMessages(m => m.content.toLowerCase() == "h" && m.author.id == message.author.id, { max: args.pings / 2, time: args.duration * 3.5 * 1000});
                await message.channel.send(`Send ${Math.ceil(args.pings / 2)} h's before the ${(args.pings * 3.5 / 2).toFixed(1)} second time limit`)
                var now = Date.now();
                var completionTime = (now - oldNow) / 1000;
                var completionTimeMs = (completionTime - Math.floor(completionTime)) * 1000;
                var timeBonus = stuff.clamp(Math.round((2000000 - ((completionTime / (args.pings * 3.5 / 2)) * 2000000)) / 100) * 100, 0, 2000000)
                var messageBonus = messages.size * 1000;
                var points = timeBonus + messageBonus;
                var interval = args.duration / (messages.size * 2)
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
                var hasReverseCard = stuff.getInventory(args.user.id).map(el => el.id).includes('reverse-card');
                if ((messages.size < args.pings / 4)) {
                    args.user = message.author
                }
                if (hasReverseCard) {
                    args.user = message.author
                    message.channel.send(`${message.author} You have been reverse card'd`)
                }
            }
            var f = !hh ? (messages.size * 2) : args.pings;
            console.log(f);
            var i = 0;
            message.channel.send(`${args.user} Starting pingcheck...`)
            var h = setInterval(() => {
                i++;
                message.channel.send(`${args.user} ${percentage.toFixed(1)}%`)
                percentage = (i / f) * 100
                if (isNaN(i / f)) {
                    clearInterval(h);
                    return;
                }
                if (i > f) {
                    clearInterval(h)
                    message.channel.send(`${args.user} Pingcheck complete`)
                }
            }, 1250)

        } catch (err) {
            stuff.sendError(message.channel, err)
        }
    }
}
var stuff = require('../stuff');
class TimeObject {
    seconds = 0;
    minutes = 0;
    hours = 0;
    _totalSeconds = 0;
    constructor(seconds) {
        var s = Math.floor(seconds) % 60;
        var m = Math.floor((seconds / 60) % 60);
        var h = Math.floor(seconds / 60 / 60);
        this.seconds = s;
        this.minutes = m;
        this.hours = h;
        this._totalSeconds = seconds;
    }
    update(seconds) {
        var t = new TimeObject(seconds);
        this.seconds = t.seconds;
        this.minutes = t.minutes;
        this.hours = t.hours;
        this._totalSeconds = t._totalSeconds;
    }
    toString() {
        return `${this.hours.toString().padStart(2, "0")}:${this.minutes.toString().padStart(2, "0")}:${this.seconds.toString().padStart(2, "0")}`
    }
}
module.exports = {
    name: "giveaway",
    requiredPermission: "commands.giveaway",
    useArgsObject: true,
    supportsQuoteArgs: true,
    arguments: [
        {
            name: "channel",
            type: "channel",
        },
        {
            name: "prize",
            type: "string",
        },
        {
            name: "duration",
            type: "time"
        },
        {
            name: "winners",
            type: "int",
            optional: true,
            default: 1
        }
    ],
    async execute(message, args) {
        var t = args.duration;
        var end = Date.now() + t;
        var timeObj = new TimeObject(t / 1000);
        var embed = {
            title: `Gibaway: ${args.prize}`,
            description: `${args.winners} winners, ${timeObj} left`,
            footer: { text: "react with 🎉 to enter" }
        }
        var channel = args.channel;
        if (!channel) throw `when the no`;
        var m = await channel.send({embed: embed});
        var entryEmojis = ['🎉', 'oO']
        var c = m.createReactionCollector((r, u) => r.emoji.name == '🎉' && !u.bot)
        await m.react("🎉");
        //await m.react("749319330503852084")
        var entrants = [];
        c.on('collect', (r, u) => {
            var h = entrants.some(v => v.id == u.id);
            console.log("h")
            console.log(h)
            if (!h) {
                console.log("yeas")
                entrants.push(u)
            }
        })
        var delay = (ms) => {
            return new Promise(resolve => setTimeout(() => resolve(), ms))
        }
        while (Date.now() < end) {
            timeObj.update((end - Date.now()) / 1000)
            embed.description = `${args.winners} winners, ${timeObj} left`
            await m.edit({embed: embed})
            await delay(6000);
        }
        c.stop();
        embed.description = `Giveaway ended`;
        await m.edit({embed: embed});
        var l = Math.min(args.winners, entrants.length);
        var winners = [];
        console.log(entrants)
        while (winners.length < l) {
            var h = entrants[Math.floor(Math.random() * entrants.length)]
            while (winners.includes(h.id)) {
                h = entrants[Math.floor(Math.random() * entrants.length)]
            }
            winners.push(h.id)
        }
        if (winners.length < 1) return await channel.send(`When nobody wins`);
        channel.send(`${winners.map(el => `<@${el}>`).join(", ")} You won the **${args.prize}**`)
    }
}
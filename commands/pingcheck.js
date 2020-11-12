module.exports = {
    name: "pingcheck",
    useArgsObject: true,
    arguments: [
        {
            type: "user",
            name: "user",
            description: "The user to pingcheck"
        },
        {
            type: 'positiveInt',
            name: 'duration',
            description: 'The duration of the pingcheck',
            default: 5,
            optional: true,
        },
        {
            type: 'positiveInt',
            name: 'pings',
            description: "The amount of pings (can't be higher than the duration multiplied by 4)",
            default: 5,
            optional: true,
        },
    ],
    cooldown: 120,
    execute(message, args) {
        if (args.pings > args.duration * 4) throw "e"
        if (args.duration > 25) throw 'e'
        var interval = args.duration / args.pings
        var percentage = 0;
        var i = 0;
        message.channel.send(`${args.user} Starting pingcheck...`)
        var h = setInterval(() => {
            i++;
            message.channel.send(`${args.user} ${percentage.toFixed(1)}%`)
            percentage = (i / args.pings) * 100
            if (i > args.pings) {
                clearInterval(h)
                message.channel.send(`${args.user} Pingcheck complete`)
            }
        }, interval)
    }
}
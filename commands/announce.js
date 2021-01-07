const stuff = require('../stuff');

module.exports = {
    name: "announce",
    description: "super important announcement!!1!!!11",
    useArgsObject: true,
    arguments: [
        {
            name: "text",
            type: "string"
        }
    ],
    requiredPermission: "commands.announce",

    execute(message, args, _extraArgs, extraArgs) {
        var str = args.text;
        if (!str) throw "you can't announce void!";
        var embed = {
            title: "announcement",
            color: 0x3679e3,
            description: str,
        }



        embed.footer = {text: extraArgs.footer};

        embed.title = extraArgs.title || "Announcement"

        var channel = message.client.channels.cache.get(stuff.getConfig("announcements"));
        channel.send({embed: embed}).then(msg => {
            if (extraArgs.publish) msg.crosspost();
            message.channel.send({
                embed: {
                    title: "oh yes",
                    description: `the announcement has been sent to ${msg.channel}`,
                    color: 0x00ee00,
                }
            })
        })
    }
}


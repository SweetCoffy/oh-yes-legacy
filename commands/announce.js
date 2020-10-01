const stuff = require('../stuff');

module.exports = {
    name: "announce",
    description: "super important announcement!!1!!!11",
    usage: "announce <thing:string>",
    requiredPermission: "commands.announce",

    execute(message, args, extraArgs) {
        var str = args.join(" ");
        if (!str) throw "you can't announce void!";
        var embed = {
            title: "announcement",
            color: 0x3679e3,
            description: str,
        }



        if (extraArgs[0] == 'footer') {
            embed.footer = {text: extraArgs[1]};
        }

        if (extraArgs[0] == 'title') {
            embed.title = extraArgs[1];
        }

        var channel = message.client.channels.cache.get(stuff.getConfig("announcements"));
        channel.send({embed: embed}).then(msg => {
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


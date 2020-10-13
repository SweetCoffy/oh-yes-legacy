const CommandError = require("../CommandError");
const stuff = require("../stuff");

module.exports = {
    name: "bug-report",
    description: "reports a bug lol",
    usage: "bug-report <issue>",
    execute(message, args) {
        if (args.length < 1) throw CommandError.undefinedError;
        var issue = args.join(" ");
        var c = message.client.channels.cache.get(stuff.getConfig("reportsChannel"))
        var embed = {
            color: 0xeb4034,
            title: "bug report",
            author: {
                name: message.author.name,
                icon: {
                    url: message.author.avatarURL()
                }
            },
            description: issue,
            fields: [
                {
                    name: "from",
                    value: message.author
                }
            ]
        }

        c.send({embed: embed}).then(() => {
            message.channel.send({embed: {
                color: 0xeb4034,
                title: "h",
                description: `bug report sent to ${c} successfully!`
            }})
        });
    }
}
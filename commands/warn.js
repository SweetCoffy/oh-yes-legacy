const Base64 = require("../Base64");
const CommandError = require("../CommandError");
const RestrictedCommand = require('../RestrictedCommand')
const stuff = require("../stuff");
var execute = function(message, args) {
    var user = args.user;
    var reason = args.reason;
    var code = `${Base64.encode((Date.now() - 1604865448408).toString())}`;
    
    stuff.db.push(`/${user.id}/warns[]`, {
        date: Date.now(),
        reason: reason,
        code: code,
    })
    stuff.dataStuff.push(`/warns/${code}`, {
        date: Date.now(),
        reason: reason,
        user: user.id,
    })
    user.send({embed: {
        title: `You've been warned by ${message.author.username}`,
        color: 0xff0000,
        description: reason,
        footer: { text: `warn code: ${code}, if you continue to do so you'll get ban- jk, most of these warns are pointless anyway` }
    }}).catch(() => console.log('oh no'))
    message.channel.send({embed: {
        title: `Warned ${user.username}`,
        color: 0xfc4e03,
        description: reason,
        fields: [ { name: 'Warn code', value: `\`${code}\`` } ]
    }})
    var channel = message.client.channels.cache.get(stuff.getConfig("crimes"))
    channel.send({embed: {
        title: `Warn alert`,
        color: 0xfc4e03,
        description: `${user} has been warned by ${message.author}`,
        fields: [
            {
                name: "Reason",
                value: reason,
            },
            {
                name: "Channel",
                value: `${message.channel} (${message.channel.id})`
            },
            {
                name: "Warn code",
                value: `\`${code}\``
            }
        ],
        timestamp: Date.now()
    }})
}
var cmd = new RestrictedCommand("warn", execute, "KICK_MEMBERS", "warns someone lol");
cmd.useArgsObject = true;
cmd.arguments = [
    {
        name: "user",
        type: "user",
        description: "The user to warn"
    },
    {
        name: "reason",
        type: "string",
        description: "The reason of the warn"
    }
]
module.exports = cmd;



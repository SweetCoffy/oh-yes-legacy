const Base64 = require("../Base64");
const CommandError = require("../CommandError");
const RestrictedCommand = require('../RestrictedCommand')
const stuff = require("../stuff");
const { createHash } = require('crypto')
var execute = function(message, args) {
    var user = args.user;
    var reason = args.reason;
    var data = {
        date: Date.now(),
        reason: reason,
        randomNumber: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    }
    var json = JSON.stringify(data);
    var n = 0;
    var number = BigInt(Date.now()) % (2n ** 20n);
    var warnHash = createHash("sha256", json).digest('hex');
    var userHash = createHash("sha256", user.id + user.username + user.tag + user.flags).digest("hex");
    for (var i = 0; i < json.length; i++) {
        n += (json.charCodeAt(i) >> i % 16 * userHash.charCodeAt(5) + userHash.charCodeAt(6) + warnHash.charCodeAt(7) + warnHash.charCodeAt(6)) % (data.randomNumber / 512) % 7;
        number += BigInt(json.charCodeAt(i) % parseInt(userHash.slice(0, 2), 16) >> i) % 7n
    }
    n = Math.floor(n)
    number += BigInt(n);
    var code = number.toString(16);
    data.code = code;
    delete data.randomNumber;
    stuff.db.push(`/${user.id}/warns[]`, data)
    stuff.addMoney(user.id, -15, "social-credit")
    user.send({embed: {
        title: `You've been warned by ${message.author.username}`,
        color: 0xff0000,
        description: reason,
        footer: { text: `warn code: ${code}, -15 social credit` }
    }}).catch(() => console.log('oh no'))
    message.channel.send({embed: {
        title: `Warned ${user.username}`,
        color: 0xfc4e03,
        description: reason,
        fields: [ { name: 'Warn code', value: `\`${code}\`` } ]
    }})
}
var cmd = new RestrictedCommand("warn", execute, "KICK_MEMBERS", "warns someone lol");
cmd.useArgsObject = true;
cmd.cooldown = .01;
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
cmd.category = "moderation"
module.exports = cmd;



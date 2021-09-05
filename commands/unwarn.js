const RestrictedCommand = require('../RestrictedCommand')
const stuff = require("../stuff");
var execute = function(message, args) {
    var index = (stuff.db.getData(`/${args.user.id}/`).warns || []).map(el => el.code).indexOf(args.code)
    if (index < 0) throw `Warn \`${args.code}\` doesn't exist in user ${args.user}`
    stuff.db.delete(`/${args.user.id}/warns[${index}]`)
    var embed = {
        color: 0x03fc35,
        title: "oh yes",
        description: `Removed warn \`${args.code}\` from ${args.user}`
    }
    message.channel.send({embed: embed})
}
var cmd = new RestrictedCommand("unwarn", execute, "KICK_MEMBERS", "unwarns someone lol")
cmd.useArgsObject = true;
cmd.arguments = [
    {
        name: 'user',
        type: 'user',
        description: 'The user to unwarn'
    },
    {
        name: "code",
        type: 'string',
        description: 'The warn code to remove'
    }
]


module.exports = cmd;
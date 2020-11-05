const CommandError = require("../CommandError");
const RestrictedCommand = require('../RestrictedCommand')
const stuff = require("../stuff");
var execute = function(message, args) {
    var user = message.mentions.users.first() || message.author;
    var warns = stuff.db.getData(`/${user.id}/`).warns || [];
    var warnList = [];
    var page = stuff.clamp((parseInt(args[1]) || 1) - 1, 0, stuff.clamp(Math.ceil(warnList.length / 5), 1, Infinity) - 1);
    var startFrom = 5 * page;
    if (warns.length < 1) throw new CommandError("No warns found", `The user ${user} doesn't have any warns`)
    warns.forEach(el => {
        var now = Date.now();
        warnList.push(`\`${el.code}\` \`\`\`${el.reason}\`\`\``)
    })
    var embed = {
        title: `${user.username}'s warn list`,
        description: warnList.slice(startFrom, startFrom + 5).join("\n"),
        footer: {
            text: `page ${page + 1}/${stuff.clamp(Math.ceil(warnList.length / 5), 1, Infinity)}`
        }
    }
    message.channel.send({embed: embed})
}
var cmd = new RestrictedCommand("unwarn", execute, ["KICK_MEMBERS", "WARN_MEMBERS"], "unwarns someone lol")
cmd.usage = "unwarn <warn code>";


module.exports = cmd;
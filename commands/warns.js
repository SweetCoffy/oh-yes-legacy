const CommandError = require("../CommandError");
const stuff = require("../stuff");

module.exports = {
    name: "warns",
    description: "shows a list of warns h",
    usage: "warns [user]",
    execute(message, args) {
        var user = message.mentions.users.first() || message.author;
        var warns = stuff.db.getData(`/${user.id}/`).warns || [];
        var warnList = [];
        if (warns.length < 1) throw new CommandError("No warns found", `The user ${user} doesn't have any warns`)
        warns.forEach(el => {
            var now = Date.now();
            warnList.push(`\`${el.code}\` \`\`\`${el.reason}\`\`\``)
        })
        var embed = {
            title: `${user.username}'s warn list`,
            description: warnList.join("\n")
        }
        message.channel.send({embed: embed})
    }
}
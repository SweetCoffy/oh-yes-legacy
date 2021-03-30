const CommandError = require("../CommandError");
const stuff = require("../stuff");

module.exports = {
    name: "warns",
    category: "moderation",
    description: "shows a list of warns h",
    useArgsObject: true,
    arguments: [
        {
            name: "user",
            type: 'user',
            optional: true,
            default: 'me',
            description: "The user to show it's warns"
        },
        {
            name: "page",
            type: 'number',
            optional: true,
            default: 1,
            description: 'The page to show'
        }
    ],
    execute(message, args) {
        var user = args.user;
        var warns = stuff.db.getData(`/${user.id}/`).warns || [];
        var warnList = [];
        var page = stuff.clamp(args.page - 1, 0, stuff.clamp(Math.ceil(warnList.length / 5), 1, Infinity));
        var startFrom = 5 * page;
        if (warns.length < 1) throw new CommandError("No warns found", `The user ${user} doesn't have any warns`)
        warns.forEach(el => {
            var now = Date.now();
            warnList.push(`\`${el.code}\` \`\`\`${el.reason}\`\`\``)
        })
        var embed = {
            title: `${user.username}'s warn list`,
            description: warnList.slice(startFrom, startFrom + 5).join("\n"),
            color: 0x03bafc,
            footer: {
                text: `page ${page + 1}/${stuff.clamp(Math.ceil(warnList.length / 5), 1, Infinity)}`
            }
        }
        message.channel.send({embed: embed})
    }
}
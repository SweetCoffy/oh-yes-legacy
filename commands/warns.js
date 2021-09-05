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
        var pageSize = 10;
        var page = args.page - 1;
        var startFrom = pageSize * page;
        if (warns.length < 1) throw new CommandError("No warns found", `The user ${user} doesn't have any warns`)
        warns.forEach(el => {
            if (el == undefined) return;
            var now = Date.now();
            var date = new Date(el.date);
            var weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            var time = Math.floor((now - el.date) / 1000);
            warnList.push({ name: `\`${el.code}\` (${(time > (24 * 60 * 60)) ? `${weekDays[date.getUTCDay()]} ${date.getUTCDate().toString().padStart(2, "0")}/${date.getUTCMonth().toString().padStart(2, "0")}/${date.getUTCFullYear()}` : `${Math.floor(time / (60 * 60)).toString().padStart(2, "0")}:${Math.floor(time % (60 * 60) / 60).toString().padStart(2, "0")}:${Math.floor(time % 60).toString().padStart(2, "0")}`})`, value: `${el.reason || "void"}` })
        })
        var embed = {
            title: `${user.username}'s warn list`,
            description: `${warns.length} Total warns`,
            fields: (warnList.reverse()).slice(startFrom, startFrom + pageSize),
            color: 0x03bafc,
            footer: {
                text: `page ${page + 1}/${stuff.clamp(Math.ceil(warnList.length / pageSize), 1, Infinity)}`
            }
        }
        message.channel.send({embed: embed})
    }
}
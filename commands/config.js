const stuff = require('../stuff');

module.exports = {
    name: "config",
    description: "shows a list of all settings",
    useArgsObject: true,
    arguments: [
        {
            name: "page",
            type: "positiveInt",
            optional: true,
            default: 1
        }
    ],
    execute (message, args) {
        var settingNames = [];
        stuff.forEachSetting(function(k, v) {
            var e = v;
            settingNames.push(`**${k}** : ${e}`)
        })
        var lastPage = Math.ceil(settingNames.length / 20)
        var pageIndex = stuff.clamp(args.page - 1, 0, lastPage - 1);
        var startFrom = (20 * pageIndex)
        var embed = {
            title: "setting list",
            description: settingNames.slice(startFrom, startFrom + 20).join("\n"),
            footer: {
                text: `Page ${pageIndex + 1}/${lastPage}`
            }
        }

        message.channel.send({embed: embed});
    }
}
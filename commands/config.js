const stuff = require('../stuff');

module.exports = {
    name: "config",
    description: "shows a list of all settings",
    execute (message, args) {
        if (message.channel.id != stuff.getConfig('botChannel')) throw "you can't execute this command outside of the bot channel!"
        
        var settingNames = [];
        stuff.forEachSetting(function(k, v) {
            var e = v;

            if (typeof v == "boolean") {
                if (v) {
                    e = '\🟩';
                } else {
                    e = '\🟥';
                }
            }

            settingNames.push(`(${typeof v}) \`${k}\`: \`${e}\``)
        })
        var embed = {
            title: "setting list",
            description: settingNames.join("\n"),
            footer: {
                text: "use ;set <setting name> <value> to set a value"
            }
        }

        message.channel.send({embed: embed});
    }
}
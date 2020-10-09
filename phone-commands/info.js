const stuff = require("../stuff");

module.exports = {
    name: "info",
    package: "h",
    author: "Sebo2205",
    execute(message, args, phoneData) {
        var embed = {
            title: `Break The Economy S${stuff.getConfig("season")} Speedrun`,
            fields: [
                {
                    name: (phoneData.os || "unknown os") + " version",
                    value: `${phoneData.verName || "h"} (${(phoneData.ver || "unknown version")})`
                },
                
            ]
        }

        message.channel.send({embed: embed});
    }
}
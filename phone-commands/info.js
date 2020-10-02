module.exports = {
    name: "info",
    package: "h",
    author: "Sebo2205",
    execute(message, args, phoneData) {
        var embed = {
            title: "phone info",
            fields: [
                {
                    name: (phoneData.os || "unknown os") + " version",
                    value: `${phoneData.verName || "h"} (${(phoneData.ver || "unknown version")})`
                }
            ]
        }

        message.channel.send({embed: embed});
    }
}
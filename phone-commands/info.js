module.exports = {
    name: "info",
    execute(message, phoneData) {
        var embed = {
            title: "phone info",
            fields: [
                {
                    name: (phoneData.os || "unknown os") + " version",
                    value: (phoneData.ver || "unknown version")
                }
            ]
        }

        message.channel.send({embed: embed});
    }
}
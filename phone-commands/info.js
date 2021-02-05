const stuff = require("../stuff");

module.exports = {
    name: "info",
    package: "h",
    author: "Sebo2205",
    execute(message, args, phoneData) {
        var storageBar = '🟦'
        var barColor = '🟥'
        var background = '⬛'
        if ((phoneData.used / phoneData.capacity) > .8) storageBar = barColor
        if (phoneData.battery.charge > 25) barColor = '🟨'
        if (phoneData.battery.charge > 45) barColor = '🟩'
        var embed = {
            title: `Break The Economy S${stuff.getConfig("season")} Any% Speedrun`,
            fields: [
                {
                    name: `💾 Storage (${(phoneData.used / phoneData.capacity * 100).toFixed(1)}%)`,
                    value: `Used: ${stuff.betterFormat(phoneData.used, stuff.formatOptions.filesize)} / ${stuff.betterFormat(phoneData.capacity, stuff.formatOptions.filesize)}\nFree: ${stuff.betterFormat(phoneData.capacity - phoneData.used, stuff.formatOptions.filesize)}\n${storageBar.repeat(stuff.clamp((phoneData.used / phoneData.capacity) * 20, 0, 20))}${background.repeat(stuff.clamp((1 - (phoneData.used / phoneData.capacity)) * 20, 0, 20))}`
                },
                {
                    name: "🔋 Battery",
                    value: `${phoneData.battery.charge.toFixed(1)}%, ${((1 / (phoneData.battery.quality ?? 1)) * 100).toFixed(1)}% Discharge rate\n${barColor.repeat(stuff.clamp((phoneData.battery.charge / 100) * 20, 0, 20))}${background.repeat(stuff.clamp((1 - (phoneData.battery.charge / 100)) * 20, 0, 20))}`
                }
            ]
        }

        message.channel.send({embed: embed});
    }
}
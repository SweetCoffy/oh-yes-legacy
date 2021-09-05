var os = require('os')
var stuff = require('../stuff')
module.exports = {
    name: "info",
    description: "shows info about the bot",
    execute(message) {
        var e = {}
        var cpus = os.cpus()
        // ((el.times.sys + el.times.user) / 1000) / el.speed
        /*for (const cpu of cpus) {
            if (!e[cpu.model]) {
                e[cpu.model] = {...cpu, count: 1}
            } else {
                e[cpu.model].count++
            }
        }*/
        //e = Object.values(e)
        var embed = {
            title: "Bot info",
        fields: [
    {
        name: "General Info",
        value: `**Name**: ${message.client.user.username}
**Developer**: <@!602651056320675840>
**Discord.js version**: ${require('../package-lock.json').dependencies['discord.js'].version}`
    },
    {
        name: "System Info",
        value: `**Platform**: ${os.platform()} (Kernel: ${os.version()}, Release: ${os.release()}, Arch: ${os.arch()})
**CPUs**: 
${os.cpus().map((el, i) => `**CPU ${i}**: **${el.model}**\nSpeed: **${el.speed / 1000}**GHz\nnot accurate usage: **${(((el.times.sys + el.times.user) / 1000) / el.speed).toFixed(1)}**%`).join("\n\n")}
**RAM**: ${stuff.betterFormat(os.totalmem(), stuff.formatOptions.filesize)} Total (also fuc you, now ram usage for you)

`
    }
    ]
}
        message.channel.send({embed: embed})
    }
}
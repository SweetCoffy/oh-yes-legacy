var { CommandInteraction, ApplicationCommand } = require('discord.js')
var vm2 = require('vm2')
var util = require('util')
module.exports = {
    type: "CHAT_INPUT",
    name: "debug",
    description: "Debug moment",
    /**
     * @type {import('discord.js').ApplicationCommandOption[]}
     */
    options: [],
    async run(i) {
        if (i.user.id != "602651056320675840") throw `no`
        var v = i.options.getString("code", true)
        var r = await i.reply({content: "Running...", fetchReply: true})
        function funi(o, d = 0) {
            var str = "";
            for (var p in o) {
                str += `${"\t".repeat(d)}${p}: `
                try {
                    var e = Object.getOwnPropertyDescriptor(o, p)
                    var j = []
                    if (e.get) j.push("Getter")
                    if (e.set) j.push("Setter")
                    if (j.length > 0) str += j.join("\n")
                    else {
                        if (typeof e.value == "object") {
                            str += "\n" + funi(e.value, d + 1)
                        } else {
                            if (typeof e.value == "string") str += `"${e.value}"`
                            else if (typeof e.value == "bigint") str += `${e.value}n`
                            else str += `${e.value}`
                        }
                    }
                    str += "\n"
                } catch (er) {
                    console.log(er)
                    str += "unknown\n"
                }
            }
            return str;
        }
        var vm = new vm2.VM({sandbox: {
            stuff: require('../stuff'),
            Discord: require('discord.js'),
            client: i.client,
            interaction: i,
            user: i.user,
            channel: i.channel,
            message: i.message,
            funi,
        }})
        var o = undefined;
        try {
            var o = vm.run(v)
        } catch (er) {
            o = er.stack || er;
        }
        var s = util.inspect(o)
        var code = "js"
        if (typeof o == "string") {
            s = o;
            code = "";
        }
        while (s.length > 0) {
            var maxChars = (2000 - 8) - (code.length + 1)
            var e = s.slice(0, maxChars)
            r = await r.reply(`\`\`\`${code}\n${e}\n\`\`\``)
            s = s.slice(maxChars)
        }
    }
}
module.exports.options.push({ type: "STRING", required: true, name: 'code', description: "The" })
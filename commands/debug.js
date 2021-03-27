var vm2 = require('vm2')
const stuff = require('../stuff')
var Discord = require('discord.js')
module.exports = {
    name: "debug",
    description: "Basically an eval command but it can access more stuff",
    requiredPermission: "commands.debug",
    arguments: [
        { name: "code", type: "string" }
    ],
    useArgsObject: true,
    execute(message, args) {
        var context = {
            message,
            process: process,
            h(test) {
                var hh = (h, _h = "") => {
                    var list = [];
                    Object.getOwnPropertyNames(h).forEach(el => {
                        if (typeof h[el] == 'object') {
                            var o = h[el];
                            var e = hh(o, _h ? `${_h}/${el}` : `${el}`);
                            list.push(...e);
                            return;
                        }
                        if (el == "token") return;
                        list.push(`${_h ? `${_h}/` : ''}${el}: ${(typeof h[el] == "string") ? `"${h[el]}"` : `${h[el]}`} `);
                    })
                    return list;
                }
                return hh(test).join('\n')
            },
            debug(...args) {
                console.log(...args)
            },
            randomString(length, offset = 4, endCharcode = 128) {
                var s = ""
                for (var i = 0; i < length; i++) {
                    s += String.fromCharCode(Math.floor(endCharcode * Math.random()) + offset)
                }
                return s;
            },
            hh(str, key = "", {offset, endCharcode}) {
                if (!key) key = context.randomString(str.length, offset ?? 69, endCharcode ?? 69)
                if (key.length < str.length) key += context.randomString(str.length - key.length, offset ?? 69, endCharcode ?? 69)
                var r = ""
                for (var i = 0; i < str.length; i++) {
                    r += String.fromCharCode(str.charCodeAt(i) + i + key.charCodeAt(i))
                }
                return r
            },
            require(module) {
                return require(module)
            },
            hhnt(str, key = "") {
                var r = ""
                for (var i = 0; i < str.length; i++) {
                    r += String.fromCharCode((str.charCodeAt(i) - i) - key.charCodeAt(i))
                }
                return r
            },
            get client() {
                if (stuff.getPermission(message.author.id, "commands.debug.client", message.guild.id)) return message.client;
                else return undefined
            },
            get stuff() {
                if (stuff.getPermission(message.author.id, "commands.debug.stuff", message.guild.id)) return stuff
                else return undefined
            },
            get Discord() {
                if (stuff.getPermission(message.author.id, "commands.debug.discord", message.guild.id)) return Discord;
                else return undefined
            },
        }
        var vm = new vm2.VM({ sandbox: context, timeout: 2000, })
        var o = vm.run(args.code)
        if (typeof o == 'string' && o.includes(require('../../config.json').token)) throw `image trying to leak the bot token`
        if (message.client.token != require('../../config.json').token) message.client.token = require('../../config.json').token
        message.channel.send({content: `${o}`, split: true, code: "js"})
    }
}
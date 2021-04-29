var vm2 = require('vm2')
const stuff = require('../stuff')
var Discord = require('discord.js')
var { inspect } = require('util')
var stream = require('stream')
const { Console } = require('console')
const { sendError } = require('../stuff')
module.exports = {
    name: "debug",
    description: "Basically an eval command but it can access more stuff",
    requiredPermission: "commands.debug",
    category: "bot",
    arguments: [
        { name: "code", type: "string" }
    ],
    useArgsObject: true,
    execute(message, args) {
        var str = ""
        class DebugConsoleOutput extends stream.Writable {
            write(...args) {
                str += args[0];
                process.stdout.write(args[0])
                WritableStream.prototype?.write?.call?.(this, ...args);
            }
        }
        var stdout = new DebugConsoleOutput()
        var stderr = new DebugConsoleOutput()
        var context = {
            message,
            console: new Console({ colorMode: false, stdout, stderr, }),
            process: process,
            h(test) {
                var hh = (h, _h = "") => {
                    var list = [];
                    try {
                        Object.getOwnPropertyNames(h).forEach(el => {
                            try {
                                if (typeof h[el] == 'object') {
                                    var o = h[el];
                                    var e = hh(o, _h ? `${_h}/${el}` : `${el}`);
                                    list.push(...e);
                                    return;
                                }
                                if (el == "token") return;
                                list.push(`${_h ? `${_h}/` : ''}${el}: ${(typeof h[el] == "string") ? `"${h[el]}"` : `${h[el]}`} `);
                            } catch (_er) {
                                console.log(_er)
                            }
                        })
                    } catch (er) {
                        return list
                    }
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
            require: require,
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
        str = str.replace(new RegExp(`${message.client.token}`, 'g'), "*".repeat(message.client.token.length))
        if (!o?.then) {
            if (str) {
                if (str.length > 1024 * 4) {
                    message.channel.send({ content: "Console output", files: [new Discord.MessageAttachment(Buffer.from(str), "output.txt")] })
                    return;
                }
                message.channel.send({content: `Console output:\n${str}`, split: true, code: "js"})
            }
        } else {
            o.then(result => {
                if (str) {
                    if (str.length > 1024 * 4) {
                        message.channel.send({ content: "Console output (Promise)", files: [new Discord.MessageAttachment(Buffer.from(str), "output.txt")] })
                    } else message.channel.send({content: `Console output:\n${str}`, split: true, code: "js"})
                }
                var r = inspect(result);
                if (r.length > 1024 * 4) {
                    message.channel.send({ content: "Output (Promise)", files: [new Discord.MessageAttachment(Buffer.from(r), "output.txt")] })
                } else message.channel.send({content: `${r}`, split: true, code: "js"});
            }).catch?.(err => {
                sendError(message.channel, err)
            })
        }
        if (message.client.token != require('../../config.json').token) message.client.token = require('../../config.json').token
        if (typeof o != 'string') o = inspect(o)
        o = o.replace(new RegExp(`${message.client.token}`, 'g'), "*".repeat(message.client.token.length))
        if (o.length > 1024 * 4) {
            message.channel.send({ content: "Output", files: [new Discord.MessageAttachment(Buffer.from(o), "output.txt")] })
            return;
        }
        message.channel.send({content: `${o}`, split: true, code: "js"});
    }
}
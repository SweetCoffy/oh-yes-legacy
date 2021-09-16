const vm2 = require('../node_modules/vm2');
const stuff = require('../stuff')
const { Worker } = require('worker_threads');
const { sendError } = require('../stuff');
const fetch = require('node-fetch')
stuff.evalWorker = new Worker('./eval-worker.js')
module.exports = {
    name: "eval",
    description: "h",
    removed: false,
    cooldown: 3,
    argParsing: false,
    lexer: false,
    arguments: [
        {
            name: "code",
            type: "string"
        }
    ],
    useArgsObject: true,
    async execute(message, args) {
        try {
            if (args.code.startsWith("\`\`\`")) {
                args.code = args.code.replace(/^```\w*\s/, "").slice(0, -3)
            }
            var code = args.code;
            var funi = {}
            code = code.replace(/^\/\/(.+)/gm, (substr, str) => {
                var a = str.split(" ")
                var cmdname = a.shift()
                a = require('shlex').split(a.join(" "))
                if (cmdname == "enable") {
                    funi[a.shift()] = true;
                }
                if (cmdname == "disable") {
                    funi[a.shift()] = false;
                }
                return substr;
            })
            var a = message.attachments.first();
            if (a) {
                if (a.size > 1024 * 256) throw `lol no`
                var r = await fetch(a.url);
                if (r.ok) {
                    var t = await r.text();
                    code = t;
                }
            }
            var id = Date.now()
            var l = (d) => {
                try {
                    if (d.id != id) return;
                    if (d.error) {
                        stuff.sendError(message.channel, d.error)
                        return;
                    }
                    var embed = {
                        title: `Code executed successfully`,
                        fields: []
                    }
                    embed.fields.push({ name: "Output", value: `\`\`\`js\n${(d.out + "").slice(0, 1000)}\n\`\`\`` })
                    if (d.console.length > 0) embed.fields.push({ name: "Console", value: `\`\`\`js\n${d.console.slice(0, 1000)}\n\`\`\`` })
                    message.channel.send({embed: embed})
                    stuff.evalWorker.removeListener('message', l)
                } catch (er) {
                    sendError(message.channel, er)
                }
            }
            stuff.evalWorker.postMessage({ id, code: code, options: funi })
            stuff.evalWorker.on('message', l)
        } catch (e) {
            sendError(message.channel, e)
        }
    }
}


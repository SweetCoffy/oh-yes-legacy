const vm2 = require('../node_modules/vm2');
const stuff = require('../stuff')
const { Worker } = require('worker_threads');
const { sendError } = require('../stuff');
const fetch = require('node-fetch')
stuff.evalWorker = new Worker('./eval-worker.js')
module.exports = {
    name: "eval",
    description: "h",
    usage: "eval <code>",
    requiredPermission: "commands.eval",
    removed: false,
    cooldown: 3,
    async execute(message, args) {
        try {
            var code = args.join(" ");
            var a = message.attachments.first();
            if (a) {
                if (a.size > 1024 * 5) throw `lol no`
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
            stuff.evalWorker.postMessage({ id, code: code })
            stuff.evalWorker.on('message', l)
        } catch (e) {
            sendError(message.channel, e)
        }
    }
}


const vm2 = require('../node_modules/vm2');
const stuff = require('../stuff')
const { Worker } = require('worker_threads');
const { sendError } = require('../stuff');
stuff.evalWorker = new Worker('./eval-worker.js')
module.exports = {
    name: "eval",
    description: "h",
    usage: "eval <code>",
    requiredPermission: "commands.eval",
    removed: false,
    cooldown: 3,
    execute(message, args) {
        try {
            var id = Date.now()
            var l = (d) => {
                if (d.id != id) return;
                if (d.error) {
                    stuff.sendError(message.channel, d.error)
                    return;
                }
                var embed = {
                    title: `Code executed successfully`,
                    fields: []
                }
                embed.fields.push({ name: "Output", value: `\`\`\`js\n${(d.out || "undefined").slice(0, 1000)}\n\`\`\`` })
                if (d.console.length > 0) embed.fields.push({ name: "Console", value: `\`\`\`js\n${d.console.slice(0, 1000)}\n\`\`\`` })
                message.channel.send({embed: embed})
                stuff.evalWorker.removeListener('message', l)
            }
            stuff.evalWorker.postMessage({ id, code: args.join(" ") })
            stuff.evalWorker.on('message', l)
        } catch (e) {
            sendError(message.channel, e)
        }
    }
}


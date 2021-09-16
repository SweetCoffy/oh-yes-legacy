var Worker = require('worker_threads').Worker
var { Collection } = require('discord.js')
var stuff = require('../stuff')
module.exports = {
    name: "brainfuck",
    useArgsObject: true,
    arguments: [
        {
            name: "code",
            type: "string"
        }
    ],
    execute(m, { code }, _h, {x, hex, out}) {
        if (!m.client.userWorkers) m.client.userWorkers = new Collection()
        if (!m.client.userWorkers.has(m.author.id))  {
            m.client.userWorkers.set(m.author.id, {
                user: m.author,
                limit: 5,
                workers: [],
            })
        }
        var w = m.client.userWorkers.get(m.author.id)
        if (w.workers.length >= w.limit) throw `no`
        var worker = new Worker("./brainfuck.js", { workerData: { code } })
        w.workers.push(worker)
        worker.on("error", (er) => {
            stuff.sendError(m.channel, er)
        })
        worker.on('messageerror', (er) => {
            stuff.sendError(m.channel, er)
        })
        var timeout = setTimeout(() => {
            worker.terminate();
            m.channel.send(`Me when it took longer than 10 seconds`)
        }, 10000)
        worker.on("exit", (code) => {
            m.channel.send(`Thread terminated with ${code} exit code`)
            var i = w.workers.indexOf(worker)
            w.workers.splice(i, 1)
            clearTimeout(timeout);
        })
        var output = ""
        worker.on("message", async(value) => {
            if (value.type == "end") {
                if (hex || x) {
                    var w = 8;
                    var s = `${" ".padStart(10, " ")} | `;
                    for (var i = 0; i < w; i++){
                        s += `${i.toString(16).padStart(2, "0")} `
                    }
                    s += `\n${"-".repeat(s.length)}`
                    s += "\n"
                    var b = value.buffer.slice(0, 1024);
                    var coolCounter = 0
                    for (var i = 0; i < b.length; i++) {
                        if (coolCounter == 0) {
                            s += `0x${Math.floor(i / w).toString(16).padStart(8, "0")} | `
                        }
                        if (coolCounter >= w) {
                            s += `\n0x${Math.floor(i / w).toString(16).padStart(8, "0")} | `
                            coolCounter = 0;
                        }
                        s += `${b[i].toString(16).padStart(2, "0")} `
                        coolCounter++;
                    }
                    m.channel.send({ content: `Hex output (${b.length}/${value.buffer.length} bytes)\n${s}`, code: true, split: true })
                }
                if (out == "string") {
                    m.channel.send({content: output, code: true})
                }
            }
            if (value.type == "print") {
                output += String.fromCharCode(value.char);
                if (out != "string") m.channel.send(`\`${value.char.toString(16).padStart(2, "0")}\``)
            }
        })
    }
}
var child = require("child_process")
var stream = require('stream')
var tty = require('tty')
var stuff = require('../stuff')
module.exports = {
    name: "spawn",
    requiredPermission: "commands.spawn",
    useArgsObject: true,
    arguments: [
        {
            name: "command",
            type: "string",
        },
        {
            name: "args",
            type: "stringArray",
            optional: true,
            default: "",
        }
    ],
    async execute(message, args) {
        if (!stuff.spawnStuff) stuff.spawnStuff = [];
        var id = stuff.spawnStuff.length - 1;
        
        class ohno extends tty.WriteStream {
            write(...args) {
                message.channel.send(args[0] + "")
                return tty.WriteStream.prototype.write.apply(this, args)
            }
        }
        var fd = require('fs').openSync(require('path').resolve("./void"), "a")
        //var o = new ohno(fd);
        var c = child.spawn(args.command, args.args || [], { stdio: ["ipc", "inherit", "inherit"], env: process.env })
        stuff.spawnStuff[id] = c;
        stuff.curId = id;
        c.on("message", (m) => {
            console.log(m);
            message.channel.send(m + "");
        })
        c.on("error", (err) => {
            console.log(err)
        })
        c.on("close", (code) => {
            stuff.spawnStuff[id] = undefined;
            message.channel.send(`${code}: kill'd`)
            require('fs').closeSync(fd);
        })
        var m = await message.channel.send("React with 🚫 to kill")
        await m.react("🚫");
        m.awaitReactions((r, u) => r.emoji.name == "🚫" && u.id == message.author.id).then(m => {
            if (m.size > 0) {
                if (!c.killed) {
                    c.kill();
                }
            }
        })
    }
}
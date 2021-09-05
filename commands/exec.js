var { spawn } = require('child_process')
const stuff = require('../stuff')
module.exports = {
    name: "exec",
    requiredPermission: "commands.exec",
    async execute(message, args, _e, e) {
        await message.channel.send(`Running j`)
        var child = spawn(args.shift(), args, { cwd: process.cwd(), shell: true })
        var c = ``;
        var m = [];
        var updating = false;
        async function updat() {
            updating = true;
            var i = 0 ;
            var s = c || "doing ur mom..."
            while (s.length > 0) {
                var maxChars = (2000 - 8) - 1
                var e = s.slice(0, maxChars)
                var str = `\`\`\`\n${e}\n\`\`\``
                if (!m[i]) m[i] = await message.channel.send(str)
                else await m[i].edit(str)
                s = s.slice(maxChars)
                i++;
            }
            updating = false;
        }
        child.stdout.on('data', (chunk) => {
            c += chunk
            if (!updating) updat()
        })
        child.stderr.on('data', (chunk) => {
            c += chunk
            if (!updating) updat()
        })
        child.on('exit', (code, sig) => {
            updat()
            message.channel.send(`Exited with code ${code} and signal ${sig}`)
        })
    }
}
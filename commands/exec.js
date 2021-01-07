var { exec } = require('child_process')
const stuff = require('../stuff')
module.exports = {
    name: "exec",
    requiredPermission: "commands.exec",
    useArgsObject: true,
    arguments: [
        {
            name: "command",
            type: "string"
        }
    ],
    async execute(message, args) {
        await message.channel.send(`Running \`${args.command}\``)
        exec(`${args.command}`, (err, out, er) => {
            if (err) {
                if (typeof er == "object") er = JSON.stringify(er, null, 4)
                stuff.sendError(message.channel, { name: `${err}`.slice(0, 255), message: `${er}`.slice(0, 2047) })
                return
            }
            var codeType = true;
            if (typeof out == "object") {out = JSON.stringify(out, null, 4); codeType = "JSON"}
            message.channel.send({ content: `${out}`, split: true, code: codeType })
        })
    }
}
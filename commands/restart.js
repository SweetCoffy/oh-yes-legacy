var c = require('child_process')
module.exports = {
    name: "restart",
    requiredPermission: "commands.restart",
    async execute(message) {
        await message.channel.send(`Restarting...`)
        c.exec(`start start.bat`, () => {})
        setTimeout(() => process.exit(0), 2500)
    }
}
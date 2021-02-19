const stuff = require("../stuff")

module.exports = {
    name: "reload",
    description: "reloads all commands lol",
    requiredPermission: 'commands.reload',
    execute(message) {
        console.clear()
        stuff.loadCommands()
        stuff.loadContent()
        stuff.loadPhoneCommands()
        stuff.updateContent()
        stuff.updateVenezuelaMode()
        stuff.updateStonks()
        message.channel.send(`Commands and items reloaded succesfully`);
    }
}
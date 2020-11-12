const stuff = require("../stuff")

module.exports = {
    name: "reload",
    description: "reloads all commands lol",
    requiredPermission: 'commands.reload',
    execute(message) {
        
        console.clear()
        stuff.loadCommands()
        message.channel.send(`Commands reloaded succesfully`);
        
    }
}
const stuff = require("../stuff")

module.exports = {
    name: "reload",
    description: "reloads all commands",
    requiredPermission: "commands.reload",
    async execute(message) {
        stuff.reloadCommands().then(_new => {
            message.channel.send(`Commands reloaded succesfully!!!1!!11!`);
        }).catch(err => {
            stuff.sendError(err);
        })
        
    }
}
const stuff = require('../stuff')

module.exports = {
    name: "reload-phone-commands",
    requiredPermission: "commands.reload-phone-commands",
    description: "Reloads phone commands without a bot restart",

    execute (message) {
        stuff.loadPhoneCommands();
        message.channel.send("Phone commands reloaded succesfully!");
    }
}
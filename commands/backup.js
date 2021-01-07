const stuff = require("../stuff")

module.exports = {
    name: "backup",
    requiredPermission: "commands.backup",
    execute(message) {
        stuff.backup();
        message.channel.send({embed: {
            title: "oh yes",
            description: "Backup done succesfully"
        }})
    }
}
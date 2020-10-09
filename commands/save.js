const stuff = require("../stuff")

module.exports = {
    name: "save",
    description: "saves data without the need of an autosave",
    requiredPermission: "commands.save",
    execute(message) {
        stuff.db.save();
        message.channel.send("Data saved succesfully!");
    }
}
const stuff = require("../stuff")

module.exports = {
    name: "forceend",
    execute(msg) {
        stuff.fighting[msg.author.id] = null;
        msg.channel.send(`col`)
    }
}
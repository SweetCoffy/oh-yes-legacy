var stuff = require('../stuff')
module.exports = {
    name: "desel",
    execute(msg) {
        stuff.db.data[msg.author.id].target = null;
        msg.channel.send(`Deselected the box`)
    }
}
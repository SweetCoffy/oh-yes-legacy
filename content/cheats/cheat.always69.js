var stuff = require('../../stuff')
module.exports = {
    name: "Always 69",
    description: "Makes your money always be 69",
    onMessage(message) {
        stuff.db.push(`/${message.author.id}/points`, 69)
    }
}
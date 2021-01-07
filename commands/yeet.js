const stuff = require("../stuff");
const RestrictedCommand = require('../RestrictedCommand')
var execute = async function(message) {
    var channel = await message.channel.clone();
    var _channel = await message.channel.setParent(stuff.getConfig("archiveCategory"));
    message.channel.send(`***Yeet***`)
}
var cmd = new RestrictedCommand("yeet", execute, "MANAGE_CHANNELS", "clones the current channel and archives the original one")

module.exports = cmd
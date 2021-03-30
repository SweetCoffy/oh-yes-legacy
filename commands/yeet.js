const stuff = require("../stuff");
const RestrictedCommand = require('../RestrictedCommand')
var execute = async function(message, _args, _e, flags) {
    if (!flags.dontClone) {
        var channel = await message.channel.clone();
    }
    var _channel = await message.channel.setParent(stuff.getConfig("archiveCategory"));
    await message.channel.send(`***Yeet***`)
    if (flags.delete && stuff.getPermission(message.author.id, 'commands.yeet.delete', message.guild.id)) {
        await _channel.delete()
    }
}
var cmd = new RestrictedCommand("yeet", execute, "MANAGE_CHANNELS", "clones the current channel and archives the original one")
cmd.category = "moderation"
module.exports = cmd
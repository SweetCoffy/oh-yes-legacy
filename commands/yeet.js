const stuff = require("../stuff");
const RestrictedCommand = require('../RestrictedCommand')
var execute = async function(message) {
    var channel = await message.channel.clone();
    var _channel = await message.channel.setParent(stuff.getConfig("archiveCategory"));

    var msg = await _channel.send(`Do you want to fully delete the old channel? React with ✅ if you agree`);
    msg.react('✅').then(r => {
        r.message.awaitReactions((re, u) => {
            return u.id == message.author && re.emoji.name == "✅";
        }, {time: 15000, max: 1, errors: ['time']}).then(() => {
            _channel.send("Okay then, yeeting old channel").then(m => {
                m.channel.delete();
                
            })
            
            
        }).catch(() => {
            _channel.send("You took too long to react, not yeeting the old channel");
        })
    })
}
var cmd = new RestrictedCommand("yeet", execute, "MANAGE_CHANNELS", "clones the current channel and archives the original one")

module.exports = cmd
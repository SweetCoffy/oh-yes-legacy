const stuff = require('../stuff')
const { Message, TextChannel } = require('discord.js')
const RestrictedCommand = require('../RestrictedCommand');
const { sendError } = require('../stuff');
/**
 * 
 * @param { Message } message 
 * @param {*} args 
 */
var execute = async function(message, args) {
    var archive = stuff.getConfig("archiveCategory");
    if (message.channel.parentID == archive) {
        var parsed 
        try {
            parsed = JSON.parse(message.channel.topic)
            if (!parsed.parent) throw `No`
            await message.channel.setTopic(parsed.topic || "");
            var c = await message.channel.setParent(parsed.parent);
            await c.lockPermissions();
            await message.channel.send(`Successfully unarchived channel`)
        } catch (er) {
            sendError(message.channel, er)
        }
        return;
    }
    var o = {
        parent: message.channel.parentID,
        topic: message.channel.topic,
    }
    var json = JSON.stringify(o)
    /**
     * @type TextChannel
     */
    var c = await message.channel.setParent(archive)
    await c.lockPermissions()
    await c.setTopic(json, 'unarchiving purposes')
    await c.send(`Successfully archived channel`);
    
}
var cmd = new RestrictedCommand("archive", execute, "MANAGE_CHANNELS", "archives the channel where the command has been performed")
module.exports = cmd

const RestrictedCommand = require('../RestrictedCommand')
const { Message } = require('discord.js')
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 */
var execute = (message, args) => {
    if (!args.member) return;
    message.channel.createOverwrite(args.member, { VIEW_CHANNEL: false, SEND_MESSAGES: false})
}
var cmd = new RestrictedCommand("channel-ban", execute, "MANAGE_CHANNELS", "lol")
.setProperty("arguments", [{name: "member", type: "member"}])
.setProperty("useArgsObject", true)
 
module.exports = cmd;
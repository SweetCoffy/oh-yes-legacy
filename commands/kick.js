const RestrictedCommand = require('../RestrictedCommand')
const { Message } = require('discord.js')
/**
 * 
 * @param {Message} message 
 * @param {*} args 
 */
var execute = (message, args) => {
    const member = message.mentions.members.first();

    if (member) {
        if (member.id == message.author.id) throw "You can't kick yourself"

        var reason = args;

        reason.shift();


        
        member.kick(reason.join(" ")).then(() => {
            message.channel.send("succesfully kicked " + member.displayName + ", reason: " + (reason.join(" ") || "none") );
        }).catch (error => {
            throw error;
        })

    } else {
        throw "you must mention a member";
    }
}
var cmd = new RestrictedCommand("kick", execute, "KICK_MEMBERS", "kicks someone lol");
cmd.usage = "kick <member>";
module.exports = cmd;
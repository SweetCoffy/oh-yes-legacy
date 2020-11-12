const RestrictedCommand = require('../RestrictedCommand')
const { Message } = require('discord.js')
/**
 * 
 * @param {Message} message 
 * @param {*} args 
 */
var execute = (message, args) => {
    const member = args.member;

    if (member.id == message.author.id) throw "You can't kick yourself"
    var reason = args.reason;
    reason.shift();
    
    member.kick(reason.join(" ")).then(() => {
        message.channel.send("succesfully kicked " + member.displayName + ", reason: " + (reason.join(" ") || "none") );
    }).catch (error => {
        throw error;
    })
}
module.exports = new RestrictedCommand("kick", execute, "KICK_MEMBERS", "kicks someone lol")
.argsObject().addArgumentObject({
    name: 'member',
    type: 'member',
    description: 'The member to kick'
}).addArgumentObject({
    name: 'reason',
    type: 'string',
    description: 'The reason for the kick',
    optional: true,
    default: ''
})

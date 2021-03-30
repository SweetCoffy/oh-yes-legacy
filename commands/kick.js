const RestrictedCommand = require('../RestrictedCommand')
const stuff = require('../stuff')
const { Message, GuildMember } = require('discord.js')
/**
 * 
 * @param {Message} message 
 * @param {*} args 
 */
var execute = (message, args) => {
    /**
     * @type GuildMember
     */
    const member = args.member;

    if (member.id == message.author.id) throw "You can't kick yourself"
    var reason = args.reason;
    if (member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) throw `You can't kick this member`
    member.kick(reason).then(() => {
        message.channel.send(`Yeeted ${member.user.tag} out of ${message.guild.name}`);
        message.client.channels.cache.get(stuff.getConfig('reportsChannel')).send({embed: {
            title: `Member kicked`,
            color: 0xfc5203,
            fields: [
                {
                    name: "Member",
                    value: member.user.tag,
                },
                {
                    name: "Reason",
                    value: `${reason || "*no reason specified*"}`,
                },
                {
                    name: "Kicked by",
                    value: `${message.author} ([This message](${message.url}))`,
                },
                {
                    name: "Channel",
                    value: `${message.channel} (${message.channel.name}, ${message.channel.id})`,
                }
            ]
        }});
    }).catch (error => {
        stuff.sendError(message.channel, error);
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
}).setProperty("category", "moderation")

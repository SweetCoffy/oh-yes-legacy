const stuff = require("../stuff");
const { GuildMember, Role, Collection } = require('discord.js')

module.exports = {
    name: "perms",
    description: "shows your permissions lol",
    usage: "perms [user]",
    execute(message, args) {
        var user = message.mentions.users.first() || message.author;
        /**
         * @type GuildMember
         */
        var member = message.guild.member(user)
        var entries = Object.entries(stuff.permissions(user.id, message.guild.id));
        var permissionNames = [];
        var r = member.roles.cache;
        entries.forEach(el => {
            permissionNames.push(`\`${el[0]}\``)
        })
        
        var embed = {
            title: `${user.username}'s permissions`,
            color: 0x4287f5,
            fields: [
                {
                    name: `Oh yes permissions (${entries.filter(el => el).length})`,
                    value: permissionNames.join(", ") || "<nothing>"
                },
                {
                    name: `Role permissions (${member.permissions.toArray(true).length})`,
                    value: (member.permissions.toArray(true).map(el => `${stuff.thing(stuff.snakeToCamel(el.toLowerCase()))}`).join(", ")) || "<nothing>"
                },
                {
                    name: `Roles (${r.size})`,
                    value: r.sort((a, b) => b.permissions.toArray().length - a.permissions.toArray().length).map(el => `${el}${(r.size > 16) ? '' : ` (${el.permissions.toArray().length} Permissions)`}`).join((r.size > 16) ? ' ' : '\n')
                }
            ],
           
        }
        message.channel.send({embed: embed})
    }
}
const { Guild, Collection } = require("discord.js");

module.exports = {
    name: "server-info",
    aliases: [ 'serverinfo' ],
    description: "shows info about the server lol",
    async execute(message, args) {
        var guild = message.guild;
        var msg = await message.channel.send(`fetching...`);
        var _members = await guild.members.fetch();
        var bots = _members.filter(v => v.user.bot)
        var members = _members.filter(v => !v.user.bot)
        var embed = {
            title: guild.name,
            color: 0x2244ff,
            description: `this server is **${((bots.size / _members.size) * 100).toFixed(1)}**% bots and **${((members.size / _members.size) * 100).toFixed(1)}**% humans`,
            fields: [
                {
                    name: "ID",
                    value: guild.id,
                    inline: true,
                },
                {
                    name: "Members",
                    value: `${_members.size} (${bots.size} bots, ${members.size} humans)`,
                    inline: true,
                },
                {
                    name: "Owner",
                    value: `<@${guild.ownerID}>`,
                    inline: true,
                },
                {
                    name: "Rules channel",
                    value: `<#${guild.rulesChannelID}>`,
                    inline: true,
                },
                {
                    name: "Region",
                    value: `${guild.region}`,
                    inline: true,
                },
                {
                    name: "Highest role",
                    value: `${guild.roles.highest}`,
                    inline: true,
                }
            ]
        }
        msg.edit({content: "", embed: embed})

    }
}
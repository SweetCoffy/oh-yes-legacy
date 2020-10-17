const { Guild, Collection } = require("discord.js");

module.exports = {
    name: "server-info",
    description: "shows info about the server lol",
    async execute(message, args) {
        var guild = message.guild;
        var msg = await message.channel.send(`fetching...`);
        var _members = await guild.members.fetch();
        var bots = _members.filter(v => v.user.bot)
        var members = _members.filter(v => !v.user.bot)
        var embed = {
            title: guild.name,
            description: `this server is **${((bots.size / _members.size) * 100).toFixed(1)}**% bots and **${((members.size / _members.size) * 100).toFixed(1)}**% humans`,
            fields: [
                {
                    name: "id",
                    value: guild.id,
                    inline: true,
                },
                {
                    name: "members",
                    value: `${_members.size} (${bots.size} bots, ${members.size} humans)`,
                    inline: true,
                },
                {
                    name: "owner",
                    value: `<@${guild.ownerID}>`,
                    inline: true,
                },
                {
                    name: "rules channel",
                    value: `<#${guild.rulesChannelID}>`,
                    inline: true,
                },
                {
                    name: "region",
                    value: `${guild.region}`,
                    inline: true,
                },
                {
                    name: "highest role",
                    value: `${guild.roles.highest}`,
                    inline: true,
                }
            ]
        }
        msg.edit({content: "", embed: embed})

    }
}
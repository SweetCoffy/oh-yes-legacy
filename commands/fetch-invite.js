const stuff = require("../stuff")

module.exports = {
    name: "fetch-invite",
    aliases: [ 'get-invite', 'getinvite', 'fetchinvite' ],
    arguments: [
        {
            name: "invite",
            type: 'string',
            description: 'The invite link to fetch'
        }
    ],
    useArgsObject: true,
    async execute(message, args) {
        try {
            var invite = await message.client.fetchInvite(args.invite)
            var guild = invite.guild;
            var canAccess = false;
            var inviter = invite.inviter;
            try {
                var g = await guild.fetch();
                guild = g;
                canAccess = true;
            } catch(_e) {
                canAccess = false;
            }
            var embed = {
                author: {
                    iconURL: guild.iconURL({ dynamic: true }),
                    url: invite.url,
                    name: guild.name,
                },
                color: 0x2244ff,
                fields: [
                    {
                        name: "Channel",
                        value: `${invite.channel} (${invite.channel.name})`
                    },
                    {
                        name: `Members`,
                        value: `⚫ ${invite.memberCount} 🟢 ${invite.presenceCount}`
                    },
                    {
                        name: `Expires in`,
                        value: invite.expiresTimestamp ? `${((Date.now() - invite.expiresTimestamp) / 1000).toFixed(1) } Seconds` : `Never`,
                    }
                ],
            }
            if (inviter) {
                embed.footer = {
                    text: invite.inviter.username,
                    iconURL: invite.inviter.avatarURL({ dynamic: true }),
                }
            }
            await message.channel.send({embed: embed})
        } catch (err) {
            stuff.sendError(message.channel, err);
        }
    }
}
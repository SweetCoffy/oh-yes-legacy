module.exports = {
    name: 'lockdown',
    description: `Locks down the channel`,
    useArgsObject: true,
    requiredPermission: 'commands.lockdown',
    arguments: [
        {
            name: 'channel',
            description: `The channel to lock down`,
            type: 'channel',
            default: 'this',
            optional: true,
        },
        {
            name: 'time',
            description: `The time in minutes to lock the channel for, 0 means infinity`,
            type: 'number',
            default: 0,
            optional: true,
        }
    ],
    async execute(message, args) {
        if (args.time == 0) {
            await args.channel.overwritePermissions([{ id: message.guild.roles.everyone.id, deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'] }])
            await message.channel.send(`The channel ${args.channel} has been locked down`)
        } else {
            var t = args.time * 1000 * 60;
            var oldOverwrites = args.channel.permissionOverwrites.map((v, k) => {return { id: k, deny: v.deny, allow: v.allow }})
            await args.channel.overwritePermissions([{ id: message.guild.roles.everyone.id, deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'] }])
            await message.channel.send(`The channel ${args.channel} has been locked down for ${args.time} minutes`)
            setTimeout(() => {
                args.channel.overwritePermissions(oldOverwrites)
                message.channel.send(`The lockdown for ${args.channel} has ended`)
            }, t) 
        }
    }
}
const stuff = require('../stuff');

module.exports = {
    name: "stats",
    description: "shows a user's stats",
    useArgsObject: true,
    arguments: [
        {
            name: "user",
            type: "user",
            optional: true,
            default: "me",
            description: "The user to show info about"
        }
    ],
    aliases: ['bal', 'balance', 'points', 'profile', 'stonks'],
    execute(message, args) {
        var user = args.user;

        var points = stuff.getPoints(user.id);
        var multiplier = stuff.getMultiplier(user.id);
        var totalMultiplier = stuff.getMultiplier(user.id, false);
        var userObject = stuff.db.getData(`/${user.id}/`)

        var embed = {
            title: `${user.username}'s stats`,
            color: stuff.globalData.getData('/').venezuelaMode ? 0xfc2c03 : 0x4287f5,
            description: `:heart: ${stuff.format(stuff.userHealth[user.id])}\n:shield: ${stuff.format(userObject.defense || 0)}`,
            fields: [
                {
                    name: "Money",
                    value: `<:ip:770418561193607169> ${stuff.format(points)}️\n:coin: ${stuff.format(stuff.getGold(user.id))}`,
                },
                {
                    name: "Money Donated (Internet Points)",
                    value: `<:ip:770418561193607169> ${stuff.format(stuff.db.getData(`/${user.id}/`).donated || 0)}`,
                },
                {
                    name: "Total Multiplier",
                    value: `${stuff.format(totalMultiplier)}`,
                },

                {
                    name: "Multiplier",
                    value: `${stuff.format(multiplier)}`,
                    inline: true,
                },
                {
                    name: "Exponent",
                    value: `${stuff.format(stuff.getMultiplierMultiplier(user.id))}`,
                    inline: true,
                },
                {
                    name: `Equipment (${stuff.getEquipment(user.id).length}/${stuff.getEquipmentSlots(user.id)})`,
                    value: `${stuff.getEquipment(user.id).map(el => el.icon).join(" ") || '*<nothing>*'}`,
                    inline: true,
                },
                {
                    name: `Taxes`,
                    value: `${stuff.getTaxes(user.id).map(el => `**${el.name}** ─ ${stuff.format(el.amount * (stuff.getMultiplier(user.id) * el.multiplierEffect))}/h (${stuff.format(el.amount * (stuff.getMultiplier(user.id) * el.multiplierEffect) / 60)}/m)`).join('\n') || 'none'}`
                }
            ],
            footer: { text: `${stuff.getPoints(user.id).toFixed(1)} + (${stuff.getGold(user.id).toFixed(1)} * 100) + ${stuff.getMultiplierMultiplier(user.id).toFixed(1)}, ${stuff.globalData.getData('/').venezuelaMode ? 'oh no venezuela mode is enabled' : 'everything is nice it seems'}` }
        }

        if ((stuff.db.getData(`/${user.id}/`).medals || []).length > 0) {
            embed.fields.push(                {
                name: "Medals",
                value: `${(stuff.db.getData(`/${user.id}/`).medals || []).map(el => el.icon).join(" ")}`,
                inline: true,
            })
        }

        message.channel.send({embed: embed})
    }
}
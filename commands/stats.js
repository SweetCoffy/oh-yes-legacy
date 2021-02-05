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
    execute(message, args, _e, extraArgs) {
        var user = args.user;

        var points = stuff.getPoints(user.id);
        var multiplier = stuff.getMultiplier(user.id);
        var totalMultiplier = stuff.getMultiplier(user.id, false);
        var userObject = stuff.db.getData(`/${user.id}/`)

        var embed = {
            author: {
                name: user.username,
                iconURL: user.avatarURL(),
            },
            color: stuff.dataStuff.getData('/').venezuelaMode ? 0xfc2c03 : 0x4287f5,
            description: `${userObject.bio || ""}`,
            fields: [
                {
                    name: "Money",
                    value: `<:ip:770418561193607169> ${stuff.format(points)}\n:coin: ${stuff.format(stuff.getGold(user.id))}`,
                    inline: true,
                },
                {
                    name: "Money Donated",
                    value: `<:ip:770418561193607169> ${stuff.format(stuff.db.getData(`/${user.id}/`).donated || 0)}`,
                    inline: true,
                },
                {
                    name: "Multiplier",
                    value: `Base Multiplier: **${stuff.format(multiplier)}**\nExponent: **${stuff.format(stuff.getMultiplierMultiplier(user.id))}**\nTotal: **${stuff.format(totalMultiplier)}**`,
                    inline: true,
                },
                {
                    name: `Equipment (${stuff.format(stuff.getEquipment(user.id).length)}/${stuff.format(stuff.getEquipmentSlots(user.id))})`,
                    value: `${stuff.getEquipment(user.id).map(el => el.icon).slice(0, 25).join(" ") || '*<nothing>*'}`,
                    inline: true,
                },
                {
                    name: `Other`,
                    value: `:heart: ${stuff.format(stuff.userHealth[user.id])}/${stuff.format(userObject.maxHealth || 100)}\n:shield: ${stuff.format(userObject.defense || 0)}\n🗡️ ${stuff.format(userObject.attack || 1)}\nPowah level: ${stuff.format(stuff.getMaxHealth(user.id) + stuff.getAttack(user.id) + stuff.getDefense(user.id))}\n**${stuff.format(stuff.getRankValue(userObject))}** Rank Value\n${(stuff.db.getData(`/${user.id}/`).medals || []).map(el => el.icon).join(" ")}`,
                    inline: true,
                },
                {
                    name: `Taxes`,
                    value: `${stuff.getTaxes(user.id).map(el => `**${el.name}** ─ ${stuff.format(el.amount * (stuff.getMultiplier(user.id) * el.multiplierEffect))}/h (${stuff.format(el.amount * (stuff.getMultiplier(user.id) * el.multiplierEffect) / 60)}/m)`).join('\n') || 'none'}`,
                    inline: true,
                }
            ],
            footer: { text: `${stuff.dataStuff.getData('/').venezuelaMode ? 'Venezuela mode is enabled' : ((userObject.points < -500) ? 'Oh no' : 'Everything looks fine')}` }
        }
        if (extraArgs.compact || stuff.getUserConfig(message.author.id).useCompactProfile) {
            delete embed.fields
            embed.description = 
`
<:ip:770418561193607169> ${stuff.format(points)}
:coin: ${stuff.format(stuff.getGold(user.id))}
${stuff.getTaxes(user.id).map(el => `**${el.name}** ─ ${stuff.format(el.amount * (stuff.getMultiplier(user.id) * el.multiplierEffect))}/h (${stuff.format(el.amount * (stuff.getMultiplier(user.id) * el.multiplierEffect) / 60)}/m)`).join('\n') || 'no taxes'}
**Multiplier**: ${stuff.format(multiplier)}
**Exponent**: ${stuff.format(stuff.getMultiplierMultiplier(user.id))}
:heart: ${stuff.format(stuff.userHealth[user.id])}/${stuff.format(userObject.maxHealth || 100)}
:shield: ${stuff.format(userObject.defense || 0)}
:dagger: ${stuff.format(userObject.attack || 1)}
**Powah level**: ${stuff.format(stuff.getMaxHealth(user.id) + stuff.getAttack(user.id) + stuff.getDefense(user.id))}
**Equipment** (${stuff.getEquipment(user.id).length}/${stuff.getEquipmentSlots(user.id)}): ${stuff.getEquipment(user.id).map(el => el.icon).slice(0, 25).join(" ") || "doesn't exist"}
**Medals**: ${(stuff.db.getData(`/${user.id}/`).medals || []).map(el => el.icon).join(" ") || 'no'}
`
        }

/*
        if ((stuff.db.getData(`/${user.id}/`).medals || []).length > 0) {
            embed.fields.push(                {
                name: "Medals",
                value: ``,
                inline: true,
            })
        }
*/
        message.channel.send({embed: embed})
    }
}
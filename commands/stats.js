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
    aliases: ['bal', 'balance', 'points', 'profile', 'stonks', 'stat'],
    execute(message, args, _e, extraArgs) {
        var user = args.user;

        var points = stuff.getPoints(user.id);
        var multiplier = stuff.getMultiplier(user.id);
        var totalMultiplier = stuff.getMultiplier(user.id, false);
        var userObject = stuff.db.getData(`/${user.id}/`)
        var medals = ``
        var achievements = ``
        var m = Object.entries(stuff.medals)
        var a = Object.entries(stuff.achievements)
        var counter = 0
        var xpBar = stuff.bar(stuff.getXP(user.id), stuff.getLevelUpXP(user.id), 25)
        for (var medal of m) {
            if (counter > 2) {
                counter = 0
                medals += "\n"
            }
            var h = (userObject.medals || [])
            var med = h.find(el => el.id == medal[0])
            if (med) {
                medals += med.icon
            } else {
                medals += "⚫"
            }
            counter++
        }
        counter = 0
        for (var achievement of a) {
            if (counter > 2) {
                counter = 0
                achievements += "\n"
            }
            var h = (userObject.achievements || [])
            var med = h.find(el => el.id == achievement[0])
            if (med) {
                achievements += achievement[1].icon
            } else {
                achievements += achievement[1].placeholder || "⚫"
            }
            counter++
        }
        var u = stuff.getUserData(user.id)
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
                    value: `${Object.entries(stuff.currencies).filter(el => stuff.getMoney(user.id, el[0]) != 0n).map(el => `${el[1].icon} ${stuff.format(stuff.getMoney(user.id, el[0]))}`).join('\n')}`,
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
                    value: `${stuff.getEquipment(user.id).map(el => el.icon).slice(0, 20).join(" ") || '*<nothing>*'}`,
                    inline: true,
                },
                {
                    name: `Other`,
                    value: `Level: ${userObject.level || 1}\n\`${xpBar}\`\nTo next level: ${stuff.format(stuff.getLevelUpXP(user.id) - stuff.getXP(user.id))}\n:heart: ${stuff.format(stuff.userHealth[user.id])}/${stuff.format(u.maxHealth)} (Base: ${stuff.getBaseHP(user.id)})\n:shield: ${stuff.format(u.defense || 0)} (Base: ${stuff.getBaseDEF(user.id)})\n🗡️ ${stuff.format(u.attack || 1)} (Base: ${stuff.getBaseATK(user.id)})\n👟 ${stuff.format(u.speed || 0)} (Base: ${stuff.getBaseSPD(user.id)})\nPowah level: ${stuff.format(stuff.getMaxHealth(user.id) + stuff.getAttack(user.id) + stuff.getDefense(user.id))}\n**${stuff.format(stuff.getRankValue(userObject))}** Rank Value\n${(medals)}`,
                    inline: true,
                },
            ],
            footer: { text: `${stuff.dataStuff.getData('/').venezuelaMode ? 'Venezuela mode is enabled' : ((userObject.points < -500) ? 'Oh no' : 'Everything looks fine')}` }
        }
        if (extraArgs.compact || stuff.getUserConfig(message.author.id).useCompactProfile) {
            delete embed.fields
            embed.description = 
`
${Object.entries(stuff.currencies).filter(el => stuff.getMoney(user.id, el[0]) > 0n).map(el => `${el[1].icon} ${stuff.format(stuff.getMoney(user.id, el[0]))}`).join('\n')}

**Multiplier**: ${stuff.format(multiplier)}
**Exponent**: ${stuff.format(stuff.getMultiplierMultiplier(user.id))}

Level: ${userObject.level || 1}
\`${xpBar}\`
Next level: ${stuff.format(stuff.getLevelUpXP(user.id) - stuff.getXP(user.id))}
:heart: ${stuff.format(stuff.userHealth[user.id])}/${stuff.format(u.maxHealth)} (Base: ${stuff.getBaseHP(user.id)})
:shield: ${stuff.format(y.defense || 0)} (Base: ${stuff.getBaseDEF(user.id)})
:dagger: ${stuff.format(y.attack || 1)} (Base: ${stuff.getBaseATK(user.id)})
👟 ${stuff.format(u.speed)} (Base: ${stuff.getBaseSPD(user.id)})
**Powah level**: ${stuff.format(stuff.getMaxHealth(user.id) + stuff.getAttack(user.id) + stuff.getDefense(user.id))}

**Equipment** (${stuff.getEquipment(user.id).length}/${stuff.getEquipmentSlots(user.id)}): ${stuff.getEquipment(user.id).map(el => el.icon).slice(0, 20).join(" ") || "doesn't exist"}
${medals || "void"}

${achievements || "also void"}
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
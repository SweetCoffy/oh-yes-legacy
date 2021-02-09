const stuff = require("../stuff")

module.exports = {
    name: 'selfrole',
    description: `Shows the self role selector`,
    cooldown: 30,
    async execute(message) {
        var roles = Object.values(stuff.selfRoles)
        var selected = 0;
        var selectedRoles = message.member.roles.cache.map(el => el.id).filter(el => roles.map(el => el.id).includes(el))
        var e = ['🔼', '🔽', '🇦', '✅']
        var embed = {
            name: `Self role selector`,
            description: `${roles.map((el, i) => `${(i == selected) ? '► ' : ''}${(selectedRoles.includes(el.id)) ? '✅' : '⬛'}<@&${el.id}> — ${el.description}`).join("\n")}`,
            footer: { text: `🔼 🔽: Move cursor\n🇦: Select\n✅: Finish` }
        }
        var msg = await message.channel.send({embed: embed})
        for (const emoji of e) {
            await msg.react(emoji)
        }
        var c = msg.createReactionCollector((r, u) => e.includes(r.emoji.name) && message.author.id == u.id, {time: 1000 * 60})
        c.on('collect', async (r, u) => {
            r.users.remove(u.id)
            if (r.emoji.name == '🔼') selected--
            if (r.emoji.name == '🔽') selected++
            selected = stuff.clamp(selected, 0, roles.length - 1)
            if (r.emoji.name == '🇦') {
                if (selectedRoles.includes(roles[selected].id)) {
                    selectedRoles.splice(selectedRoles.indexOf(roles[selected].id), 1)
                } else selectedRoles = [...new Set([...selectedRoles, roles[selected].id])]
            }
            updateEmbed()
            if (r.emoji.name == '✅') {
                c.stop()
                await msg.delete()
                var rolesToRemove = roles.map(el => el.id).filter(el => !selectedRoles.includes(el))
                var rolesToAdd = selectedRoles
                for (const r of rolesToRemove) {
                    message.member.roles.remove(r)
                }
                for (const r of rolesToAdd) {
                    message.member.roles.add(r)
                }
            }
        }).on('end', () => msg.reactions.removeAll())
        async function updateEmbed() {
            embed.description = `${roles.map((el, i) => `${(i == selected) ? '► ' : ''}${(selectedRoles.includes(el.id)) ? '✅' : '⬛'}<@&${el.id}> — ${el.description}`).join("\n")}`
            msg = await msg.edit({embed: embed})
        }
    }
}
const stuff = require("../stuff")

module.exports = {
    name: 'selfrole',
    aliases: ['role'],
    description: `Shows the self role selector`,
    arguments: [
        {
            name: "roles",
            type: "stringArray",
            optional: true,
            default: [],
        }
    ],
    useArgsObject: true,
    cooldown: 1,
    async execute(message, args) {
        var roles = Object.values(stuff.selfRoles)
        console.log(args.roles)
        if (args.roles?.length > 0 && args.roles?.[0]) {
            var member = await message.member.fetch();
            var added = []
            var removed = []
            for (var i = 0; i < args.roles.length; i++) {
                var r = message.guild.roles.cache.get(roles.find(el => message.guild.roles.cache.get(el.id)?.name.toLowerCase().includes(args.roles[i].toLowerCase())).id)
                if (r) {
                    if (member.roles.cache.has(r.id)) {
                        removed.push(r);
                        await member.roles.remove(r);
                    } else {
                        added.push(r);
                        await member.roles.add(r);
                    }
                }
            }
            await message.channel.send(`Added ${added.length} and removed ${removed.length} roles`);
            return;
        }
        var selected = 0;
        var selectedRoles = message.member.roles.cache.map(el => el.id).filter(el => roles.map(el => el.id).includes(el))
        var e = ['🔼', '🔽', '🇦', '✅']
        var embed = {
            title: `Self role selector`,
            color: 0x0390fc,
            description: `${roles.map((el, i) => `${(i == selected) ? '► ' : ''}${(selectedRoles.includes(el.id)) ? '✅' : '⬛'}<@&${el.id}> — ${el.description}`).join("\n")}`,
            footer: { text: `🔼 🔽: Move cursor\n🇦: Select\n✅: Done` }
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
                var rolesToRemove = roles.map(el => el.id).filter(el => !selectedRoles.includes(el))
                var rolesToAdd = selectedRoles
                for (const r of rolesToRemove) {
                    message.member.roles.remove(r)
                }
                for (const r of rolesToAdd) {
                    message.member.roles.add(r)
                }
            }
        }).on('end', async () => {
            msg.reactions.removeAll()
            selected = -1;
            embed.footer = { text: `No` }
            updateEmbed()
        })  
        async function updateEmbed() {
            embed.description = `${roles.map((el, i) => `${(i == selected) ? '► ' : ''}${(selectedRoles.includes(el.id)) ? '✅' : '⬛'} <@&${el.id}> — ${el.description}`).join("\n")}`
            msg = await msg.edit({embed: embed})
        }
    }
}
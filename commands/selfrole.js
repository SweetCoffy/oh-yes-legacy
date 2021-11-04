const stuff = require("../stuff")
var { Message, MessageActionRow, MessageButton } = require('discord.js')
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
    /**
     * 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    async execute(message, args) {
        var roles = Object.values(stuff.getConfig(`guilds.${message.guild.id}.selfroles`) || {})
        if (roles.length <= 0) throw `This guild doesn't have any self roles`
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
        var msg = await message.channel.send({embeds: [embed], components: [new MessageActionRow({ components: [
            new MessageButton({ emoji: e[0], style: "PRIMARY", customId: "up" }),
            new MessageButton({ emoji: e[1], style: "PRIMARY", customId: "down" }),
            new MessageButton({ emoji: e[2], style: "SUCCESS", customId: "a" }),
            new MessageButton({ emoji: e[3], style: "SUCCESS", customId: "done" })
        ] })]})
        //for (const emoji of e) {
        //    await msg.react(emoji)
        //}
        var c = msg.createMessageComponentCollector((r, u) => e.includes(r.emoji.name) && message.author.id == u.id, {time: 1000 * 60})
        c.on('collect', async (i) => {
            if (i.user.id != message.author.id) return await i.reply({ ephemeral: true, content: "This isn't for you, you fucking egger" })
            if (i.customId == 'up') selected--
            if (i.customId == 'down') selected++
            selected = stuff.clamp(selected, 0, roles.length - 1)
            if (i.customId == "a") {
                if (selectedRoles.includes(roles[selected].id)) {
                    selectedRoles.splice(selectedRoles.indexOf(roles[selected].id), 1)
                } else selectedRoles = [...new Set([...selectedRoles, roles[selected].id])]
            }
            updateEmbed()
            await i.deferUpdate()
            if (i.customId == 'done') {
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
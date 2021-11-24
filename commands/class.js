var stuff = require('../stuff')
var { Message, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js")
module.exports = {
    name: "class",
    /**
     * 
     * @param {Message} msg 
     */
    async execute(msg) {
        var m = await msg.channel.send({embeds: [{
            description: "Doing ur mom..."
        }]})
        var showClass = stuff.getClass(msg.author.id)
        // ❤️ 🛡️ 🗡️ 👟
        async function update() {
            var pclass = stuff.classes[showClass]
            // 🟥 🟨 🟩
            function bar(v = 0) {
                var max = 200
                var width = 15
                var fill = "🟩"
                var bg = "⬛"
                var f = v / max
                if (f < 0.25) {
                    fill = "🟨"
                }
                if (f < 0.125) {
                    fill = "🟥"
                }
                var len = Math.ceil(f * width)
                var str = ""
                var i = 0
                for (var i = 0; i < len; i++) {
                    str += fill
                }
                for (;i < width; i++) {
                    str += bg
                }
                return str
            }
            await m.edit({
                embeds: [{
                    title: `${pclass.icon} ${pclass.name}`,
                    description: 
`${pclass.description}
\`HP  ${pclass.hp .toString().padStart(3, " ")}\` ${bar(pclass.hp / 3) } \`600\`
\`DEF ${pclass.def.toString().padStart(3, " ")}\` ${bar(pclass.def)    } \`200\`
\`ATK ${pclass.atk.toString().padStart(3, " ")}\` ${bar(pclass.atk)    } \`200\`
\`SPD ${pclass.spd.toString().padStart(3, " ")}\` ${bar(pclass.spd)    } \`200\`
Total: ${pclass.hp + pclass.def + pclass.atk + pclass.spd}`
                }],
                components: [
                    new MessageActionRow().addComponents(new MessageSelectMenu().setMinValues(1).setMaxValues(1).setCustomId("class").addOptions(
                        ...Object.keys(stuff.classes).map(el => {
                            return {
                                emoji: stuff.classes[el].icon,
                                value: el,
                                default: el == showClass,
                                label: stuff.classes[el].name,
                                description: stuff.classes[el].description
                            }       
                        }),
                    )),
                    new MessageActionRow().addComponents(new MessageButton().setStyle("SUCCESS").setLabel((showClass == stuff.getClass(msg.author.id)) ? "Selected" : "Select").setDisabled(showClass == stuff.getClass(msg.author.id)).setCustomId("select"))
                ]
            })
            var c = await m.awaitMessageComponent({
                filter: function(i) {
                    if (i.user.id != msg.author.id) {
                        i.reply({ephemeral: true, content: "fuck u"})
                        return false
                    }
                    return true
                }
            })
            if (c.isSelectMenu()) {
                showClass = c.values[0]
                c.deferUpdate()
                await update()
            } else {
                stuff.db.data[msg.author.id].class = showClass
                c.reply({ephemeral: true, content: `Your class has been changed to ${stuff.classes[showClass].name}`})
                await update()
            }
        }
        await update()
    }
}
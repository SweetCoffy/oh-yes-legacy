var stuff = require('../stuff')
var Discord = require('discord.js')
if (!stuff.dump) stuff.dump = {
    log: [],
    stored: 0n,
}
module.exports = {
    name: "dump",
    description: "The money dump",
    /**
     * 
     * @param {Discord.Message} msg 
     */
    async execute(msg) {
        function getDesc() {
            return `Throw your entire life savings in here for everyone else to take\nIn dump: ${stuff.format(stuff.dump.stored)}\nLog:\n\`\`\`${stuff.dump.log.slice(-20).join("\n") || "empty, just like ur mom inside"}\`\`\``
        }
        var embed = {
            title: `Money Dump™️`,
            description: getDesc()
        }
        var m = await msg.channel.send({
            embeds: [
                embed,
            ],
            components: [new Discord.MessageActionRow({ components: [
                new Discord.MessageButton({ emoji: "📥", label: "Store", type: "BUTTON", style: "SUCCESS", customId: "in" }),
                new Discord.MessageButton({ emoji: "📤", label: "Take", type: "BUTTON", style: "DANGER", customId: "out" }),
                new Discord.MessageButton({ label: "Log", type: "BUTTON", style: "SECONDARY", customId: "log" }),
                new Discord.MessageButton({ label: "End", type: "BUTTON", style: "SECONDARY", customId: "end" }),
            ] })]
        })
        var col = m.createMessageComponentCollector({ time: 60000 }).on('collect', async i => {
            if (i.customId == "in") {
                var options = [
                    0.1,
                    0.2,
                    0.3,
                    0.4,
                    0.5,
                    0.6,
                    0.7,
                    0.8,
                    0.9,
                    1.0
                ]
                var money = Number(stuff.getMoney(i.user.id))
                var e = await i.reply({fetchReply: true, content: "How much to store", components: [
                    new Discord.MessageActionRow({components: [
                        new Discord.MessageSelectMenu({
                            customId: "amt",
                            minValues: 1,
                            maxValues: 1,
                            options: options.map((e, i) => {
                                return { label: `${stuff.format(money * e)} (${(e * 100).toFixed(1)}%)`, value: i + "" }
                            })
                        })
                    ]})
                ]})
                var i_ = await e.awaitMessageComponent({ filter: (i_) => {
                    var e = i_.customId == "amt" && i_.user.id ==  i.user.id;
                    if (!e) i_.reply({ content: "This isn't for you, you fucking egger", ephemeral: true })
                    return e;
                }})
                var a = Math.floor(Number(stuff.getMoney(i.user.id)) * options[i_.values[0]])
                stuff.dump.stored += BigInt(a)
                stuff.addMoney(i.user.id, -a)
                await i_.reply({ content: `Stored ${stuff.format(a)}`, ephemeral: true })
                await i.deleteReply()
                stuff.dump.log.push(`${i.user.username} Stored ${stuff.format(a)}`)
                embed.description = getDesc()
                stuff.addMoney(i.user.id, Math.floor(options[i_.values[0]] * 30), "social-credit")
                await m.edit({embeds: [embed]})
            } else if (i.customId == "out") {
                var options = [
                    0.01,
                    0.025,
                    0.050,
                    0.075,
                    0.100,
                    0.125,
                    0.150,
                    0.175,
                    0.200,
                    0.225,
                    0.250,
                ]
                var stored = Number(stuff.dump.stored)
                var e = await i.reply({fetchReply: true, content: "How much to take", components: [
                    new Discord.MessageActionRow({components: [
                        new Discord.MessageSelectMenu({
                            customId: "amt",
                            minValues: 1,
                            maxValues: 1,
                            options: options.map((e, i) => {
                                return { label: `${stuff.format(stored * e)} (${(e * 100).toFixed(1)}%)`, value: i + "" }
                            })
                        })
                    ]})
                ]})
                var i_ = await e.awaitMessageComponent({ filter: (i_) => {
                    var e = i_.customId == "amt" && i_.user.id ==  i.user.id;
                    if (!e) i_.reply({ content: "This isn't for you, you fucking egger", ephemeral: true })
                    return e;
                }})
                stuff.addMoney(i.user.id, -Math.floor(options[i_.values[0]] * (30 * 4)), "social-credit")
                var a = Math.floor(Number(stuff.dump.stored) * options[i_.values[0]])
                stuff.dump.stored -= BigInt(a)
                stuff.addMoney(i.user.id, a)
                await i_.reply({ content: `Took ${stuff.format(a)}`, ephemeral: true })
                await i.deleteReply()
                stuff.dump.log.push(`${i.user.username} Took ${stuff.format(a)}`)
                embed.description = getDesc()
                await m.edit({embeds: [embed]})
            } else if (i.customId == "end") {
                await i.deferUpdate()
                col.stop()
            } else if (i.customId == "log") {
                await i.reply({content: "Here is the whole fucking log", files: [new Discord.MessageAttachment(Buffer.from(stuff.dump.log.join("\n")), "log.txt")]})
            }
        }).on('end', () => {
            var c = m.components;
            c[0].components.map(el => el.disabled = true)
            m.edit({ embeds: m.embeds, components: c })
        })
    }
}
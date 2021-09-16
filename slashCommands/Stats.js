var { CommandInteraction, ApplicationCommand, ContextMenuInteraction } = require('discord.js')
var stuff = require('../stuff')
module.exports = {
    type: "USER",
    name: "Stats",
    /**
     * @type {import('discord.js').ApplicationCommandOption[]}
     */
    options: [],
    /**
     * 
     * @param {ContextMenuInteraction} i 
     */
    async run(i) {
        try {
            if (i.targetType != "USER") return;
            var u = await i.client.users.fetch(i.targetId)
            var d = stuff.db.data[u.id]
            var data = stuff.getUserData(u.id)
            console.log(data)
            await i.reply({ephemeral: true, embeds: [{
                author: {
                    name: `${u.username}`,
                    icon_url: u.displayAvatarURL(),
                },
                description: `${d.bio || "bion't"}\n\nLevel ${data.level}\n\`${stuff.bar(data.xp, data.levelUpXP, 32)}\` ${stuff.format(data.xp)}/${stuff.format(data.levelUpXP)}`,
                fields: [
                    {
                        name: "Money",
                        value: Object.entries(data.money).filter(el => el[1] != 0).map(([k, v]) => `${stuff._currencies[k].icon} ${stuff.format(v)}`).join("\n") || "broke lol"
                    },
                    {
                        name: "Multiplier",
                        value: `Base: ${stuff.format(data.multiplier)}\nExponent: ${stuff.format(data.exponent)}\nTetrative: ${stuff.format(data.tetrative)}\nTotal: ${stuff.format(data.totalMultiplier)}`
                    }
                ]
            }]})
        } catch (er) {
            console.error(er)
        }
    }
}
//module.exports.options.push({ type: "STRING", required: true, name: 'json', description: "The" })
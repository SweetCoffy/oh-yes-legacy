var { Message, MessageActionRow, MessageButton } = require('discord.js')
module.exports = {
    name: "pain",
    /**
     * 
     * @param {Message} msg 
     */
    async execute(msg) {
        var m = await msg.reply({
            embeds: [{
                title: "The Fucking Sun",
                description: "The Fucking Sun",
                author: {
                    name: 'The Fucking Sun'
                },
                footer: { text: "The Fucking Sun" },
            }],
            components: [
                new MessageActionRow({components: [new MessageButton({label: 'The Fucking Sun', style: "PRIMARY", customId: "sun"})]})
            ]
        })
        m.createMessageComponentCollector({componentType: "BUTTON"}).on("collect", async(i) => {
            await i.reply({ ephemeral: true, content: "The Fucking Sun", components: [new MessageActionRow({components: [new MessageButton({label: 'The Fucking Sun', style: "PRIMARY", customId: "sun"})]})] })
        })
    }
}
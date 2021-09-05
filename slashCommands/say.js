var { CommandInteraction, ApplicationCommand } = require('discord.js')
module.exports = {
    type: "CHAT_INPUT",
    name: "say",
    description: "Says soemthing",
    /**
     * @type {import('discord.js').ApplicationCommandOption[]}
     */
    options: [],
    async run(i) {
        var v = i.options.getString("text", true)
        var e = i.options.getBoolean("ephemeral", false) ?? false
        await i.reply({ content: v, ephemeral: e })
    }
}
module.exports.options.push({ type: "STRING", required: true, name: 'text', description: "The" }, { type: "BOOLEAN", required: false, name: "ephemeral", description: "Fucking Sun" })
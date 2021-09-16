var { CommandInteraction, ApplicationCommand } = require('discord.js')
module.exports = {
    type: "CHAT_INPUT",
    name: "say-json",
    description: "Says soemthing",
    /**
     * @type {import('discord.js').ApplicationCommandOption[]}
     */
    options: [],
    async run(i) {
        var v = JSON.parse(i.options.getString("json", true))
        await i.reply(v)
    }
}
module.exports.options.push({ type: "STRING", required: true, name: 'json', description: "The" })
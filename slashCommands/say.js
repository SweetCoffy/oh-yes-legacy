module.exports = {
    name: "say",
    async execute(i, _interaction, args) {
        if (args.text) {
            return await i.callback.post({data: {type: 4, data: { content: args.text.text }}})
        } else if (args.embed) {
            return await i.callback.post({data: {type: 4, data: { embeds: [{ title: args.embed.title, description: args.embed.description, footer: { text: args.embed.footer }}] }}})
        }
    }
}
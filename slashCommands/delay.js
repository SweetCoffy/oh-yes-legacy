module.exports = {
    name: "delay",
    async execute(i, _interaction, args, client) {
        var delay = d => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(), d)
            })
        }
        if (Number(args.seconds) > 60 * 14) throw `The wait time cannot be longer than 14 minutes`
        var d = await i.callback.post({data: {type: 5}})  
        await delay(Number(args.seconds) * 1000);
        await client.api.webhooks[client.user.id][_interaction.token].messages['@original'].patch({ data: { embeds: [{ title: "ha ha yes", description: `${args.seconds} seconds have passed` }] } })
        return d;
    }
}
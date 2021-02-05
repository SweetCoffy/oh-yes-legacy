module.exports = {
    name: "ping",
    async execute(message, args) {     
        //if (message.author.id == '676696728065277992') return message.channel.send(`***Don't you dare commit bully***`)
        const embed = {
            title: "Pong",
            description: `API ping: ${message.client.ws.ping}ms`
        }
        var m = await message.channel.send({ embed: embed })
        var ping = m.createdTimestamp - message.createdTimestamp;
        embed.description += `\nClient ping: ${ping}ms`
        m.edit({embed: embed, content: ""});
    }
}
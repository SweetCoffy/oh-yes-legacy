const { MessageAttachment } = require('discord.js');

module.exports = {
    name: "quote",
    description: "Quotes something, you can add a custom title by adding `--title \"insert title here\"`",
    arguments: [
        {
            name: "image",
            type: "string",
            optional: true,
            default: undefined,
        },
    ],
    useArgsObject: true,
    async execute(message, {image}, _e, flags) {
        var kolor = parseInt(flags.color?.padStart?.(6, "f"), 16) || 0x0033ff;
        var channel = await message.client.channels.fetch(require('../stuff').getConfig("quotes"))
        var regex = /https:\/\/.+?.com\/channels\/(\d+)\/(\d+)\/(\d+)/
        var match = image.match(regex)
        console.log(match)
        if (match) {
            var c = await message.client.channels.fetch(match[2])
            var m = await c.messages.fetch(match[3])
            var embed = {
                author: {
                    name: m.author.username,
                    icon_url: m.author.displayAvatarURL(),
                    url: m.url,
                },
                title: flags.title,
                color: kolor,
                description: m.content,
                footer: { text: `Quoted by ${message.author.username}`, url: m.url }
            }
            var a = m.attachments.first();
            if (a) {
                embed.image = { url: a.url }
            }
            if (!a && !m.content) throw `when empty`
            var m_ = await channel.send({embed: embed})
            await message.channel.send({embed: {
                title: "Quoted",
                color: kolor,
                description: `[clicc here](${m_.url})`
            }})
        } else {
            var url = image || message.attachments.first()?.url;
            if (!url) throw `when no image provided`
            var embed = {
                author: {name: message.author.username, icon_url: message.author.displayAvatarURL()},
                title: flags?.title,
                color: kolor,
                image: { url: url, size: 4096 },
            }
            if (!flags?.title) delete embed.title;
            var m_ = await channel.send({embed: embed})
            await message.channel.send({embed: {
                title: "Quoted",
                color: kolor,
                description: `[clicc here](${m_.url})`
            }})
        }
    }
}
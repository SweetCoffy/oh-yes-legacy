const Discord = require('discord.js');
var jimp = require('jimp')
module.exports = {
    name: "bar",
    async execute(i, _interaction, args, client) {
        await i.callback.post({data: { type: 5, data: { content: "*intense waiting*" } }})
        var j = await jimp.create(Number(args.max), 1, 0x111111ff)
        var h = client.api.webhooks[client.user.id][_interaction.token].messages['@original'];
        for (var x = 0; x < Number(args.value); x++) {
            j.setPixelColor(0x00ff00ff, x, 0);
        }
        var f = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)
        var w = 1024;
        var b = await j.resize(w, 64, jimp.RESIZE_NEAREST_NEIGHBOR).print(f, (w / 2) - (jimp.measureText(f, `${args.value} / ${args.max}`) / 2), jimp.measureTextHeight(f, `${args.value} / ${args.max}`, w / 2) / 2, `${args.value} / ${args.max}`).getBufferAsync(jimp.MIME_PNG)
        await h.patch({ data: { content: `commit wait`}})
        await client.channels.resolve(_interaction.channel_id).send(`There is your bar`, new Discord.MessageAttachment(b))
        await h.delete()
    } 
}
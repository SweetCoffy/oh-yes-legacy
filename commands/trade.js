const { MessageAttachment, Message, TextChannel } = require('discord.js');
var jimp = require('jimp')
var { resolve } = require('path')
module.exports = {
    name: "trade",
    category: "img",
    useArgsObject: true,
    supportsQuoteArgs: true,
    cooldown: 10,
    arguments: [
        {
            name: "iReceive",
            type: "string"
        },
        {
            name: "youReceive",
            type: "string"
        }
    ],
    description: `\`\`\`
|                     TRADE OFFER                     |
I receive: a single message  You receive: a trade offer    
\`\`\`
`,
    async execute(message, args) {
        await message.channel.send(`Doing the magik...`)
        var i = await jimp.create(resolve("./trade.png"));
        var f = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        var ir = jimp.measureText(f, args.iReceive, 231);
        var yr = jimp.measureText(f, args.youReceive, 231);
        var b = await i.print(f, 100 - Math.floor(ir / 2), 211, args.iReceive, 200).print(f, 460 - Math.floor(yr / 2), 211, args.youReceive, 200).quality(25).getBufferAsync(jimp.MIME_JPEG)
        await message.channel.send({ files: [ new MessageAttachment(b, "tradeoffer.jpeg") ] })
    }  
}

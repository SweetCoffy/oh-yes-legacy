const stuff = require('../stuff')
const Jimp = require('../node_modules/jimp')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "color",
    aliases: ['colour', 'kolor', 'kolour'],
    useArgsObject: true,
    arguments: [
        {
            name: "color",
            type: "string",
        }
    ],
    cooldown: 5,
    async execute(message, args) {
        var c = parseInt(args.color, 16);
        // 11 22 33 FF
        var r = c >> (2 * 8); 
        var g = (c >> (1 * 8)) & 0x0000FF;
        var b = (c >> 8) & 0x0000FF;
        
        var msg = await message.channel.send(`doing the magik...`)

        new Jimp(128, 128, stuff.clamp( ((c << 8) | 0x000000FF), 0, 4294967295), async(err, image) => {
            if (err) {
                msg.edit("something went wrong <:v_:755546914715336765>");
                
                return;
            }
            if (image) {
                try {
                    await image.writeAsync('eggs.png')
                    var embed = new MessageEmbed()
                    .setColor(c)
                    .setTitle(`There you go`)
                    .setDescription(`RGB: ${r}, ${g}, ${b}`)
                    .attachFiles(['eggs.png'])
                    .setImage('attachment://eggs.png')
                    await msg.channel.send({embed: embed})
                    msg.delete();
                } catch (err) {
                    
                    msg.edit("something went wrong <:v_:755546914715336765>");
                }
            } else {
                msg.edit("something went wrong <:v_:755546914715336765>");
            }

        });

    }
}
const stuff = require('../stuff')
const Jimp = require('../node_modules/jimp')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "color",
    usage: "color <color:rrggbb>",
    cooldown: 30,
    async execute(message, args) {
        var c = stuff.clamp(parseInt(args[0], 16), 0, 16777215)
        
        var msg = await message.channel.send(`doing the magik...`)

        new Jimp(128, 128, stuff.clamp(parseInt(`${args[0]}ff`, 16), 0, 4294967295), async(err, image) => {
            if (err) {
                msg.edit("something went wrong <:v_:755546914715336765>");
                console.log(err)
                return;
            }
            if (image) {
                try {
                    await image.writeAsync('eggs.png')
                    var embed = new MessageEmbed()
                    .setColor(c)
                    .setTitle(`There you go`)
                    .attachFiles(['eggs.png'])
                    .setImage('attachment://eggs.png')
                    .setFooter(`Image generation powered by Jimp`)
                    await msg.channel.send({embed: embed})
                    msg.delete();
                } catch (err) {
                    console.log(err)
                    msg.edit("something went wrong <:v_:755546914715336765>");
                }
            } else {
                msg.edit("something went wrong <:v_:755546914715336765>");
            }

        });

    }
}
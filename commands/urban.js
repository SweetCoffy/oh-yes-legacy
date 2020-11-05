const { Message } = require("discord.js");
const stuff = require("../stuff")

module.exports = {
    name: "urban",
    cooldown: 10,
    /**
     * 
     * @param {Message} message 
     * @param {*} args 
     */
    async execute(message, args) {
        if (args.length < 1) throw "e";
        
        try {
            var def = await stuff.define(args.join(" "));
            var e = stuff.uFormat(def.example);
            var embed = {
                author: {
                    name: def.author
                },
                title: `${def.word}`,
                color: 0x4287f5,
                description: stuff.uFormat(def.definition),
                fields: [
                    {
                        name: "👍",
                        value: stuff.format(def.thumbs_up),
                        inline: true,
                    },
                    {
                        name: "👎",
                        value: stuff.format(def.thumbs_down),
                        inline: true,
                    },
                ]
            }
            var embed2 = { color: 0x4287f5 };
            if (e.length > 1024) {
                embed2.title = "example";
                embed2.description = e;
                embed.fields.unshift({
                    name: "example",
                    value: `*(example was too long to be shown on this embed (${e.length}/1024), displaying it on the next message)*`
                })
            } else {
                embed.fields.unshift({
                    name: "example",
                    value: e,
                })
                if (!e) embed.fields.shift();
            }
            await message.channel.send({embed: embed})
            if (embed2.title) {
                await message.channel.send({embed: embed2})
            }
        } catch (err) {
            stuff.sendError(message.channel, err);
        }
    }
}
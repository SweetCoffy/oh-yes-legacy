const { Message } = require("discord.js");
const stuff = require("../stuff")

module.exports = {
    name: "urban",
    cooldown: 5,
    useArgsObject: true,
    arguments: [
        {
            name: "term",
            type: "string",
            description: "The term to search for in Urban Dictionary"
        }
    ],
    /**
     * 
     * @param {Message} message 
     * @param {*} args 
     */
    async execute(message, args, _h, extraArgs) {
        if (args.length < 1) throw "e";
        
        try {
            var def = await stuff.define(args.term, extraArgs.sorting);
            var e = stuff.uFormat(def.example)
            var d = stuff.uFormat(def.definition)
            var embed = {
                author: {
                    name: def.author
                },
                title: `${def.word}`,
                color: 0x4287f5,
                description: stuff.uFormat(def.definition).slice(0, 2048),
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
            var embed2 = { title: "Example", description: e.slice(0, 2048), color: 0x4287f5 };
            var embed3 = {
                description: stuff.uFormat(def.definition).slice(2048, 2048 * 2),
                color: 0x4287f5,
            }
            if (stuff.uFormat(def.definition).length > 2048) {
                embed3.fields = embed.fields;
                embed.fields = [];
            }
            await message.channel.send({embed: embed})
            if (d.length > 2048) await message.channel.send({embed: embed3})
            if (e) await message.channel.send({embed: embed2})
        } catch (err) {
            stuff.sendError(message.channel, err);
        }
    }
}
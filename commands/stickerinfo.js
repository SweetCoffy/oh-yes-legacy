const Discord = require('discord.js')

module.exports = {
    name: "stickerinfo",
    aliases: ["sticker-info", "sticker", "si"],
    useArgsObject: true,
    arguments: [
        {
            type: "string",
            name: "stickerName",
        }
    ],
    /**
     * 
     * @param {Discord.Message} msg
     */
    async execute(msg, args) {
        /**
         * @type {Discord.Sticker[]}
         */
        var stickers = []
        if (msg.reference) {
            var m = await msg.fetchReference()
            stickers = await Promise.all(m.stickers.map(el => el.fetch()))
        }
        if (!stickers.length) {
            //var st = await msg.guild.stickers.fetch()
            //var s = st.find(el => el.id == args.stickerName || el.name.toLowerCase() == args.stickerName?.toLowerCase())
            //stickers.push(s)
        }
        if (!stickers.length) throw `stickern't moment`
        console.log(stickers)
        var embeds = []
        for (var s of stickers) {
            var image = `https://media.discordapp.net/stickers/${s.id}.png`
            var embed = {
                title: `${s.name}`,
                description: `Id: ${s.id}\nGuild: ${s.guild.name}\nImage URL: ${image}`,
                image: {
                    url: image,
                }
            }
            embeds.push(embed)
        }
        await msg.reply({
            embeds: embeds
        })
    }
}
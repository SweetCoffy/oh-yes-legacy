const { default: Axios } = require('axios')
const stuff = require('../stuff')
module.exports = {
    name: "lyrics",
    useArgsObject: true,
    cooldown: 5,
    arguments: [{ name: "song", type: "string" }],
    async execute(message, args) {
        try {
            if (!args.song) throw `do not`
            var url = `https://some-random-api.ml/lyrics?title=${encodeURIComponent(args.song)}`
            var msg = await message.channel.send(`:mag: Searching lyrics for ${args.song}...`)
            var res = await Axios.get(url)   
            var length = res.data.lyrics?.length || 0
            var lyrics = res.data.lyrics || "???"
            var embeds = []
            for (var i = 0; i < length; i += 2048) {
                embeds.push({
                    description: lyrics.slice(i, i + 2048),
                    color: 0x0ea8e6,
                })
            }
            embeds[0].title = `Lyrics of "${res.data.title || "???"}"`
            if (res.data.thumbnail?.genius) embeds[0].thumbnail = { url: res.data.thumbnail.genius }
            embeds[embeds.length - 1].footer = {text: `${res.data.title || "???"} by ${res.data.author || "???"}`}
            for (const e of embeds) {
                await message.channel.send({embed: e})
            }
        } catch (err) {
            stuff.sendError(message.channel, err)
        }
    }
}
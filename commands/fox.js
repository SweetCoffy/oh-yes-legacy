var {default: Axios} = require('axios')
const { sendError } = require('../stuff')
module.exports = {
    name: "fox",
    cooldown: 5,
    async execute(message) {
        try {
            var f = await Axios.get('https://some-random-api.ml/facts/fox')
            var img = await Axios.get('https://some-random-api.ml/img/fox')
            var embed = {
                title: "Random fox facts",
                thumbnail: { url: img.data.link },
                description: f.data.fact || "<:v_:755546914715336765>",
                color: 0x0ea8e6,
            }
            message.channel.send({embed: embed})
        } catch (err) {
            sendError(message.channel, err)
        }
    }
}
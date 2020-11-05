const stuff = require("../stuff");
const { default: Axios } = require('axios')
const Colors = [
    0x2cfc03,
    0xcafc03,
    0x03fcb5,
    0x03a5fc,
    0x9003fc,
]

module.exports = {
    name: "meme",
    description: "ha ha yes get meme'd",
    cooldown: 5,
    async execute(message) {
        try {
            var _data = await (await Axios.get("https://reddit.com/r/memes/random.json"))
            var data = _data.data[0].data.children[0].data;
            var comments = _data.data[1].data.children;
            message.channel.send({embed: {
                author: {
                    url: "https://reddit.com" + data.permalink,
                    name: data.title
                },
                image: {
                    url: data.url
                },
                color: Colors[Math.floor(Math.random() * Colors.length)],
                footer: {
                    text: `posted by ${data.author} | 💬 ${stuff.format(comments.length)} 👍 ${stuff.format(data.ups)} 👎 ${stuff.format(data.downs)}`,
                }
            }})
        } catch (err) {
            stuff.sendError(message.channel, err)
        }
    }
}
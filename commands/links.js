module.exports = {
    name: "links",
    execute(message) {
        var embed = {
            title: "links go brrrr",
            description: `[Some Random API](https://some-random-api.ml/)\n[Color Picker](https://www.google.com/search?client=opera-gx&q=color+picker&sourceid=opera&ie=UTF-8&oe=UTF-8)\n[Mindustry Modding Wiki](https://simonwoodburyforget.github.io/mindustry-modding/)\n[Discord.js Docs](https://discord.js.org/#/docs/main/stable/general/welcome)\n[Discord.js Guide](https://discordjs.guide/)`
        }
        message.channel.send({embed: embed})
    }
}
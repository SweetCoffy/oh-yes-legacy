module.exports = {
    name: "stonks",
    description: "get stonk'd lol",
    execute(message) {
        var embed = {
            title: "get stonk'd lol",
            image: {
                url: 'https://cdn.discordapp.com/attachments/748893288081260667/765017469340614686/significato-stonks-1024x766-1.jpg'
            }
        }
        message.channel.send({embed: embed});
    }
}
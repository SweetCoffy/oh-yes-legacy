const stuff = require("../stuff");
module.exports = {
    name: "fun-fact",
    aliases: ['funfact', 'fact'],
    cooldown: 3,
    execute(message) {
        var fact = stuff.funFact
        var author = message.client.users.cache.get(fact.author)
        var embed = {
            author: {
                name: author.username,
                iconURL: author.avatarURL(),
            },
            color: 0x2222ff,
            title: "Fun fact",
            description: fact.content,
            timestamp: fact.created,
        }
        if (fact.imageURL) {
            embed.image = { url: fact.imageURL, width: 2048, height: 2048 }
        }
        message.channel.send({embed: embed})
    }
}
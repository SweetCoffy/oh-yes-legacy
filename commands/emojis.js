const { Message } = require('discord.js')

module.exports = {
    name: "emojis",
    /**
     * 
     * @param {Message} message 
     */
    async execute (message) {
        var guilds = message.client.guilds.cache;
        var emojis = [];
        for (const g of guilds) {
            var guild = await g.fetch();
            var _emojis = guild.emojis.cache;
            _emojis.forEach(emoji => {
                emojis.push(emoji)
            })
        }
        var embed = {
            title: `Emoji leaderboard`,
            description: emojis.map(el => el.toString()).join("")
        }
        message.channel.send({embed: embed});
    }
}
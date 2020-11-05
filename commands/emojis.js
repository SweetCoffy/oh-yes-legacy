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
        guilds.forEach(async g => {
            var guild = await g.fetch();
            var _emojis = guild.emojis.cache;
            _emojis.forEach(emoji => {
                emojis.push(emoji)
            })
        })  
        // don't ask why i'm doing this
        setTimeout(() => {
            var embed = {
                title: `the bot currently can use ${emojis.length} custom emojis from ${guilds.size} servers`,
                description: emojis.map(el => el.toString()).join("")
            }
            message.channel.send({embed: embed});
        }, 700)
    }
}
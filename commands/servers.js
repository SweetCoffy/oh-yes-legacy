const { Message } = require('discord.js')

module.exports = {
    name: "servers",
    /**
     * 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(message, args) {

        var guilds = message.client.guilds.cache;
        var embed = {
            title: `the bot is in ${guilds.size} servers`,
            description: guilds.map(el => `**${el.name}** (\`${el.id}\`)`).join("\n"),
            footer: {
                text: `idk why would you want to see in what servers the bot is when the bot is only intended for a single server anyway`
            }
        }
        message.channel.send({embed: embed})

    }
}
const { Message } = require("discord.js")
const stuff = require('../../stuff')
module.exports = {
    name: "Brazil Flag",
    icon: "🇧🇷",
    inStock: 9999999,
    price: 99999999999999999999999,
    rarity: stuff.rarity.purple,
    currency: "gold",
    veModeExclusive: true,
    description: 'Use it to send someone to Brazil',
    /**
     * 
     * @param {string} user 
     * @param {Message} message 
     */
    async onUse(user, message) {
        stuff.removeItem(user, 'brazil-flag')
        await message.react('🇧🇷')
        var msgs = await message.channel.awaitMessages(m => m.author.id != user && !m.author.bot, { max: 5, time: 15000 })
        try {msgs.forEach(async el => await el.react('🇧🇷'))} catch (er) {console.log(er)}
        var authorIDs = [...new Set(msgs.map(el => el.author.id))]
        if (authorIDs.length < 1) {
            await message.channel.send(`${message.author} You couldn't send anyone to brazil, ***Now you are going to Brazil with me***`)
            authorIDs.push(message.author.id)
        }
        var brazil = message.client.channels.cache.get(stuff.getConfig('brazil', message.channel.id))
        await brazil.send(`${authorIDs.map(el => `<@${el}>`).join(" ")} Welcome to Brazil`)
    }
}
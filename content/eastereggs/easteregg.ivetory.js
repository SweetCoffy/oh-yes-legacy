const { MessageFlags } = require('discord.js')
var stuff = require('../../stuff')
module.exports = {
    triggerCheck: () => false,
    onTrigger (message) {
        stuff.addAchievement(message.author.id, { id: "easteregg:ivetory", name: "Ivetory", description: `${message.author} unlocked the "Ivetory" cheat`, rarity: stuff.rarity.blue })
        stuff.addCheat(message.author.id, 'ivetory')
    }
}
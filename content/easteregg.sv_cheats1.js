const { MessageFlags } = require('discord.js')
var stuff = require('../stuff')
module.exports = {
    triggerCheck: message => message.content == "sv_cheats 1",
    onTrigger (message) {
        stuff.addAchievement(message.author.id, { id: "easteregg:sv_cheats1", name: "sv_cheats 1", description: `${message.author} unlocked the "Always 69" cheat`, rarity: stuff.rarity.blue })
        stuff.addCheat(message.author.id, 'always69')
    }
}
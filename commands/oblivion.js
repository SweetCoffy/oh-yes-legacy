const { Message } = require("discord.js");
const CommandError = require("../CommandError");
const stuff = require("../stuff")

module.exports = {
    name: "oblivion",
    category: "economy",
    description: "The third layer of prestige, makes you do a thing in the 420th dimension to get literal galaxies",
    /**
     * 
     * @param {Message} message 
     */
    execute(message) {
        if (stuff.getMoney(message.author.id, 'sun') < stuff.getConfig("oblivionMinimum")) throw new CommandError("Not enough money", `You need at least ${stuff.format(stuff.getConfig("oblivionMinimum"))} to do the thing`)
        var moni = BigInt(stuff.getMoney(message.author.id, 'sun')) / 10000000n;
        var total = BigInt(moni);
        var embed = {
            title: "prestige",
            description: `**how much 🌌 Cheesy Ways you will get:**
            
from Money: __**${stuff.format(moni)}**__
            
Total: \`${stuff.format(total)}\`
Are you sure to do prestige? (react with ✅ to confirm)
            `,
        }

        message.channel.send({embed: embed}).then(msg => {
            msg.react('✅');
            msg.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == "✅", {max: 1, time: 15000, errors: ['time']}).then(() => {
                stuff.db.push(`/${message.author.id}/points`, 0)
                stuff.db.push(`/${message.author.id}/gold`, 0)
                stuff.db.push(`/${message.author.id}/suns`, 0)
                stuff.db.push(`/${message.author.id}/multiplier`, 1)
                stuff.db.push(`/${message.author.id}/maxHealth`, 100)
                stuff.db.push(`/${message.author.id}/inventory`, [])
                stuff.db.push(`/${message.author.id}/pets`, [])
                stuff.db.push(`/${message.author.id}/defense`, 1)
                stuff.db.push(`/${message.author.id}/attack`, 1)
                stuff.db.push(`/${message.author.id}/equipment`, [])
                stuff.db.push(`/${message.author.id}/equipmentSlots`, 6)
                stuff.addMoney(message.author.id, Number(total.toString()), 'cheesy-way')
                stuff.addMoney(message.author.id, Number(total.toString()) / 1000, 'capacity')
                stuff.addAchievement(message.author.id, {
                    id: "other:oblivion",
                    name: "First Oblivion",
                    description: `${message.author} Did a thing in the 420th dimension`,
                    rarity: stuff.rarity.yellow,
                })
                stuff.addMedal(message.author.id, stuff.medals['galaxy-stonks']);
                message.channel.send(`${message.author} Just did prestige lol`);
            }).catch(err => {message.channel.send(`${message.author} You didn't react in time, cancelling prestige`); console.log(err)})
        });
        

        

    }
}
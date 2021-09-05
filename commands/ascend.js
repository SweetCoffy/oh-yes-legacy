const { Message } = require("discord.js");
const CommandError = require("../CommandError");
const stuff = require("../stuff")

module.exports = {
    name: "ascend",
    category: "economy",
    description: "The second layer of prestige, makes you ascend into the 69th dimension to get The Fucking Suns™️ at the cost of most of your stuff being reset",
    /**
     * 
     * @param {Message} message 
     */
    execute(message) {
        if (stuff.getGold(message.author.id) < stuff.getConfig("ascendMinimum")) throw new CommandError("Not enough money", `You need at least ${stuff.format(stuff.getConfig("ascendMinimum"))} to ascend`)
        var moni = BigInt(stuff.getGold(message.author.id)) / 1000000000000000000n;
        var total = BigInt(moni);
        var embed = {
            title: "prestige",
            description: `**how much <:thefukinsun:819716692602781696> The Fucking Suns:tm: you will get:**
            
from Money: __**${stuff.format(moni)}**__
            
Total: \`${stuff.format(total)}\`
Are you sure to do prestige? (react with ✅ to confirm)
            `,
        }

        message.channel.send({embed: embed}).then(async msg => {
            await msg.react('✅');
            msg.awaitReactions({max: 1, time: 15000, errors: ['time'], filter: (reaction, user) => user.id == message.author.id && reaction.emoji.name == "✅"}).then(() => {
                stuff.db.push(`/${message.author.id}/points`, 0)
                stuff.db.push(`/${message.author.id}/gold`, 0)
                stuff.db.push(`/${message.author.id}/multiplier`, 1)
                stuff.db.push(`/${message.author.id}/maxHealth`, 100)
                stuff.db.push(`/${message.author.id}/inventory`, [])
                stuff.db.push(`/${message.author.id}/pets`, [])
                stuff.db.push(`/${message.author.id}/defense`, 1)
                stuff.db.push(`/${message.author.id}/attack`, 1)

                stuff.db.push(`/${message.author.id}/level`, 1)
                stuff.db.push(`/${message.author.id}/levelUpXP`, 25)
                stuff.db.push(`/${message.author.id}/xp`, 0)

                stuff.db.push(`/${message.author.id}/equipment`, [])
                stuff.db.push(`/${message.author.id}/equipmentSlots`, 6)
                stuff.addMoney(message.author.id, Number(total.toString()), 'sun')
                stuff.addAchievement(message.author.id, {
                    id: "other:ascend",
                    name: "First Ascension",
                    description: `${message.author} Ascended into the 69th dimension just to get some The Fucking Suns™️`,
                    rarity: stuff.rarity.purple,
                })
                stuff.addMedal(message.author.id, stuff.medals['sun-stonks']);
                message.channel.send(`${message.author} Just did prestige lol`);
            }).catch(err => {message.channel.send(`${message.author} You didn't react in time, cancelling prestige`); console.log(err)})
        });
        

        

    }
}
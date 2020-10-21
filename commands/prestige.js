const { Message } = require("discord.js");
const CommandError = require("../CommandError");
const stuff = require("../stuff")

module.exports = {
    name: "prestige",
    description: "resets basically all of your data for gold coins, seems legit",
    
    /**
     * 
     * @param {Message} message 
     */
    execute(message) {
        if (stuff.getPoints(message.author.id) < stuff.getConfig("prestigeMin")) throw new CommandError("Not enough money", `You need at least ${stuff.format(stuff.getConfig("prestigeMin"))} to do prestige!`)
        var mult = stuff.getMultiplier(message.author.id);
        var moni = stuff.getPoints(message.author.id);
        moni /= 10000000;
        mult /= 10000000;
        var niceId = message.author.id.includes("69") ? 4200000000 : 0;
        var niceTag = message.author.discriminator.includes("69") ? 4200000 : 0;
        var e = Math.pow(2, stuff.getEquipment(message.author.id).length)
        var inv = Math.min(stuff.getInventory(message.author.id).length, e) * 2
        var warns = -((stuff.db.getData(`/${message.author.id}/`).warns || []).length * 10)
        var total = moni + inv + warns + niceId + niceTag + mult;
        var embed = {
            title: "prestige",
            description: `**how much :coin: gold you will get:**
            
            from Money: __**${stuff.format(moni)}**__
            from Multiplier: __**${stuff.format(mult)}**__
            from Items/Equipment: __**${stuff.format(inv)}**__
            from Warns: __**${stuff.format(warns)}**__
            from Nice tag: __**${stuff.format(niceTag)}**__
            from Nice ID: __**${stuff.format(niceId)}**__
            
            Total: \`${stuff.format(total)}\`
            Are you sure to do prestige? (react with ✅ to confirm)
            `
        }

        message.channel.send({embed: embed}).then(msg => {
            msg.react('✅');
            msg.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == "✅", {max: 1, time: 15000, errors: ['time']}).then(() => {
                stuff.db.push(`/${message.author.id}/points`, 0)
                stuff.db.push(`/${message.author.id}/multiplier`, 1)
                stuff.db.push(`/${message.author.id}/maxHealth`, 100)
                stuff.db.push(`/${message.author.id}/inventory`, [])
                stuff.db.push(`/${message.author.id}/pets`, [])
                stuff.db.push(`/${message.author.id}/defense`, 0)
                stuff.db.push(`/${message.author.id}/equipment`, [])
                stuff.db.push(`/${message.author.id}/equipmentSlots`, 6)
                stuff.addGold(message.author.id, total)
                stuff.addAchievement(message.author.id, {
                    id: "other:prestige",
                    name: "First Prestige",
                    description: `${message.author} Comitted prestige for the first time lol`,
                    rarity: stuff.rarity.red,
                })
                message.channel.send(`${message.author} Just did prestige lol`);
            }).catch(() => message.channel.send(`${message.author} You didn't react in time, cancelling prestige`))
        });
        

        

    }
}
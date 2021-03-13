const { Message } = require("discord.js");
const CommandError = require("../CommandError");
const stuff = require("../stuff")

module.exports = {
    name: "rebirth",
    description: "The first layer of prestige, resets quite a lot of your stuff for gold, you will also keep your The Fucking Suns™️ if you have ascended before",
    aliases: ['self-perish'],
    /**
     * 
     * @param {Message} message 
     */
    execute(message) {
        if (stuff.getPoints(message.author.id) < stuff.getConfig("prestigeMin")) throw new CommandError("Not enough money", `You need at least ${stuff.format(stuff.getConfig("prestigeMin"))} to do rebirth`)
        var mult = BigInt(Math.floor(stuff.getMultiplier(message.author.id) / 10000000));
        var moni = stuff.getPoints(message.author.id) / 10000000n;
        var niceId = message.author.id.includes("69") ? 4200000000n : 0n;
        var niceTag = message.author.discriminator.includes("69") ? 4200000n : 0n;
        var e = Math.pow(2, stuff.getEquipment(message.author.id).length)
        var inv = BigInt(Math.min(stuff.getInventory(message.author.id).length, e) * 2)
        var warns = BigInt(-((stuff.db.getData(`/${message.author.id}/`).warns || []).length * 10))
        var total = BigInt(moni + inv + warns + niceId + niceTag + mult);
        var totalSlots = stuff.clamp(Number(total / 1000000n), 0, stuff.getConfig('prestigeSlotsMax', 5));
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
            `,
            footer: { text: `you also got ${1 + totalSlots} equipment slots` }
        }

        message.channel.send({embed: embed}).then(msg => {
            msg.react('✅');
            msg.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == "✅", {max: 1, time: 15000, errors: ['time']}).then(() => {
                stuff.db.push(`/${message.author.id}/points`, 0)
                stuff.db.push(`/${message.author.id}/multiplier`, 1)
                //stuff.db.push(`/${message.author.id}/maxHealth`, 100)
                stuff.db.push(`/${message.author.id}/inventory`, [])
                stuff.db.push(`/${message.author.id}/pets`, [])
                stuff.db.push(`/${message.author.id}/defense`, 0)
                stuff.db.push(`/${message.author.id}/attack`, 1)
                stuff.db.push(`/${message.author.id}/equipment`, [])
                stuff.db.push(`/${message.author.id}/equipmentSlots`, stuff.getEquipmentSlots(message.author.id) + (1 + totalSlots))
                stuff.addGold(message.author.id, total)
                stuff.addAchievement(message.author.id, {
                    id: "other:prestige",
                    name: "First Prestige",
                    description: `${message.author} Comitted prestige for the first time lol`,
                    rarity: stuff.rarity.red,
                })
                stuff.addMedal(message.author.id, stuff.medals['gold-stonks']);
                message.channel.send(`${message.author} Just did prestige lol`);
            }).catch(err => {message.channel.send(`${message.author} You didn't react in time, cancelling prestige`); console.log(err)})
        });
        

        

    }
}
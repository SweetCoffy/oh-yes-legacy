const { Channel, TextChannel, Guild, Collection } = require("discord.js");
const stuff = require("../stuff");

module.exports = {
    name: 'yeet-archive',
    description: "fully yeets the archived channels",
    requiredPermission: "commands.yeet-archive",
    async execute(message) {
        var guild = message.guild;
        var archived = guild.channels.cache.filter(value => {
            return value.parentID == stuff.getConfig("archiveCategory")
        })

        var msg = await message.channel.send(`Are you sure to yeet **${archived.size}** archived channels? React with ✅ to confirm`)
        var r = await msg.react('✅');
        console.log (archived)
        r.message.awaitReactions((r, u) => {
            return r.emoji.name == "✅" && u.id == message.author.id;
        }, {max: 1, time: 15000, errors: ['time']}).then(async() => {
            message.channel.send(`Okay then, yeeting all the ${archived.size} archived channels`);
            for (const c of archived) {
                try {
                    await c[1].delete()
                } catch (er) {
                    console.log(er)
                }
            }
            var msg = await message.channel.send(`Yeeted ${archived.size} channels`);
        }).catch(err => {
            console.log(err)
            message.channel.send("You took too long to react, cancelling yeet");
        })

        
    }
}
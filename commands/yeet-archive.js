const { Channel, TextChannel, Guild, Collection } = require("discord.js");
const stuff = require("../stuff");

module.exports = {
    name: 'yeet-archive',
    description: "fully yeets the archived channels",
    requiredPermission: "commands.yeet-archive",
    async execute(message) {
        var guild = message.guild;
        var archived = guild.channels.cache.filter(value => {
            console.log(value.parentID)
            return value.parentID == stuff.getConfig("archiveCategory")
        })

        var msg = await message.channel.send(`Are you sure to fully yeet the **${archived.size}** archived channels? React with ✅ to confirm`)
        var r = await msg.react('✅');
        console.log (archived)
        r.message.awaitReactions((r, u) => {
            return r.emoji.name == "✅" && u.id == message.author.id;
        }, {max: 1, time: 15000, errors: ['time']}).then(async() => {
            var yeetedList = [];
            message.channel.send(`Okay then, yeeting all the ${archived.size} archived channels`);
            archived.forEach(async c => {
                await c.delete();
                yeetedList.push(`Yeeted ${c.name} (${c.id})`)
            })
            var msg = await message.channel.send(`Yeeted ${archived.size} channels! React with ✅ to see the yeeted channels`);
            await msg.react('✅');
            msg.awaitReactions((r, u) => {
                return r.emoji.name == "✅" && u.id == message.author.id;
            }, {max: 1, time: 15000, errors: ['time']}).then(() => {
                msg.edit(`Yeeted channel list: \n${yeetedList.join("\n")}`)
            }).catch(() => {})
        }).catch(() => {
            message.channel.send("You took too long to react, cancelling yeet");
        })

        
    }
}
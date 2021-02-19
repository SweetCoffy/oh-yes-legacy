const { fighting } = require("../stuff");
const stuff = require("../stuff");

module.exports = {
    name: "start-season",
    description: "starts a new season and resets data",
    requiredPermission: "commands.start-season",
    execute (message) {
        message.channel.send("Are you sure to start a new season? React with ✅ to confirm").then(m => {
            m.react("✅").then(() => {
                m.awaitReactions((r, u) => {
                    return u.id == message.author.id && r.emoji.name == "✅";
                }, {max: 1, time: 15000, errors: ['time']}).then(() => {
                    
                    message.channel.send("Okay then, resetting data and starting a new season");
                    var entries = Object.entries(stuff.db.getData("/"));
                    entries.forEach(el => {
                        stuff.db.push(`/${el[0]}/points`, 6000)
                        stuff.db.push(`/${el[0]}/multiplier`, 1)
                        stuff.db.push(`/${el[0]}/maxHealth`, 100)
                        stuff.db.push(`/${el[0]}/multiplierMultiplier`, 1)
                        stuff.db.push(`/${el[0]}/gold`, 0)
                        stuff.db.push(`/${el[0]}/taxes`, [])
                        stuff.db.push(`/${el[0]}/inventory`, [])
                        stuff.db.push(`/${el[0]}/pets`, [])
                        stuff.db.push(`/${el[0]}/defense`, 0)
                        stuff.db.push(`/${el[0]}/attack`, 1)
                        stuff.db.push(`/${el[0]}/equipment`, [])
                        stuff.db.push(`/${el[0]}/equipmentSlots`, 6)
                        stuff.db.push(`/${el[0]}/achievements`, [])
                        stuff.userHealth = {}
                        stuff.fighting = {}
                    })
                    stuff.set("season", stuff.getConfig("season") + 1)
                    stuff.venezuelaMode = false;
                    message.channel.send("Data reset and started a new season lol");
                    message.client.channels.cache.get(stuff.getConfig(`announcementsChannel`)).send({embed: {
                        title: `Season ${stuff.getConfig("season")} has started lol`,
                        color: 0x7734eb,
                        description: `All user data has been reset lol`
                    }})
                }).catch(err => {
                    console.log(err);
                    message.channel.send("You took too long to react, cancelling data reset");
                })
            })
        })
    }
}
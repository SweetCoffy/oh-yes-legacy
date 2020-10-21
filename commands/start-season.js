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
                        stuff.db.push(`/${el[0]}/points`, 0)
                        stuff.db.push(`/${el[0]}/multiplier`, 1)
                        stuff.db.push(`/${el[0]}/maxHealth`, 100)
                        stuff.db.push(`/${el[0]}/multiplierMultiplier`, stuff.getMultiplierMultiplier(el[0]) * 0.25)
                        stuff.db.push(`/${el[0]}/gold`, stuff.getGold(el[0]) * 0.25)
                        stuff.db.push(`/${el[0]}/inventory`, [])
                        stuff.db.push(`/${el[0]}/pets`, [])
                        stuff.db.push(`/${el[0]}/defense`, 0)
                        stuff.db.push(`/${el[0]}/equipment`, [])
                        stuff.db.push(`/${el[0]}/equipmentSlots`, 6)
                        stuff.db.push(`/${el[0]}/achievements`, [])
                        stuff.userHealth = [];
                    })
                    stuff.set("season", stuff.getConfig("season") + 1)
                    message.channel.send("Data reset and started a new season!");
                    message.client.commands.get("announce").execute(message, [`Season ${stuff.getConfig("season")} of "get the phone and break the economy any% speedrun" started!!1!!!1!!`], ["title", "new season alert!!1!!!1"])
                }).catch(err => {
                    message.channel.send("You took too long to react, cancelling data reset");
                })
            })
        })
    }
}
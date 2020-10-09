const { Message, TextChannel } = require("discord.js");
const stuff = require("../stuff")
module.exports = {
    name: "reset-data",
    description: "resets an user/everyone's data",
    usage: "reset-data <userId|everyone>",
    requiredPermission: "commands.reset-data",
    execute(message, args) {
        if (args[0] == "everyone") {
            message.channel.send("Are you sure to reset everyone's data?, react with ✅ to continue").then(m => {
                m.react("✅").then(() => {
                    m.awaitReactions((r, u) => {
                        return u.id == message.author.id && r.emoji.name == "✅";
                    }, {max: 1, time: 15000, errors: ['time']}).then(() => {
                        
                        message.channel.send("Okay then, resetting data");
                        stuff.db.delete("/");
                        message.channel.send("Data reset successfully!");
                    }).catch(err => {
                        message.channel.send("You took too long to react, cancelling data reset");
                    })
                })
            })
        } else {
            stuff.db.delete("/" + args[0]);
            message.channel.send(`deleted <@${args[0]}>'s data succesfully!`);
        }
    }
}
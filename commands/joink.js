const { Message, Channel } = require("discord.js");
const CommandError = require("../CommandError")

module.exports = {
    name: "joink",
    description: "joinks an embed and sends it",
    usage: "joink <message id>",
    execute(message, args) {
        var id = args[0]
        if (!id) throw new CommandError("e", "e");
        var msg = message.channel.messages.cache.get(id);
        if (!msg) throw new CommandError("undefined", "undefined", "[intentional bot design]")
        var embed = msg.embeds[0];
        message.channel.send({embed: embed});
    }
}
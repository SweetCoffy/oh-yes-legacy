const CommandError = require("../CommandError");
const { Message } = require('discord.js')

module.exports = {
    name: "send-all",
    description: "sends a message in every channel because why not",
    requiredPermission: "commands.send-all",
    /**
     * 
     * @param {Message} message 
     * @param {*} args 
     */
    async execute(message, args) {
        var msg = args.join(" ");
        if (args.length < 1) throw CommandError.undefinedError;
        var progress = 0;
        var _msg = await message.channel.send(`Sending messages, ${(progress * 100).toFixed(1)}%`);
        var channels = message.guild.channels.cache.filter(v => v.send);
        /**
         * @type Message[]
         */
        var messages = [];
        channels.forEach(async c => {
            if (!c.send) return;
            var m = await c.send(msg);
            messages.push(m);
            progress = messages.length / channels.size
            await _msg.edit(`Sending messages, ${(progress * 100).toFixed(1)}%`)
        })
        _msg.delete();
        var embed = {
            title: "messages sent succesfully",
            description: `message urls:\n${messages.map((m, i) => `[#${i + 1}](${m.url})`).join("\n")}`
        }
        await message.channel.send({embed: embed});
    }
}
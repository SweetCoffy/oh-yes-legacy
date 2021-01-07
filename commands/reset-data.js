const { Message, TextChannel } = require("discord.js");
const stuff = require("../stuff")
module.exports = {
    name: "reset-data",
    aliases: ['yeet-user', 'yeetuser', 'perish'],
    description: "resets data lol",
    arguments: [
        {
            name: "user",
            type: "user",
            description: "The user to reset it's data"
        }
    ],
    useArgsObject: true,
    requiredPermission: "commands.reset-data",
    execute(message, args) {
        stuff.db.delete("/" + args.user.id);
        message.channel.send(`deleted <@${args.user.id}>'s data succesfully`);
    }
}
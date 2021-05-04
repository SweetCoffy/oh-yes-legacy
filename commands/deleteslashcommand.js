const stuff = require("../stuff")
var fs = require('fs')
module.exports = {
    name: "deleteslashcommand",
    requiredPermission: "commands.deleteSlashCommand",
    useArgsObject: true,
    arguments: [
        {
            name: "id",
            type: "string"
        },
    ],
    async execute(message, args) {
        if (!stuff.slashCommands) stuff.slashCommands = {}
        var d = await message.client.api.applications['739191927647240301'].guilds[message.guild.id].commands[args.id].delete();
        await message.channel.send(`Command \`${stuff.slashCommands[args.id]}\` deleted successfully`)
        stuff.slashCommands[args.id] = undefined;
    }
}
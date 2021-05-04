const stuff = require("../stuff")
var fs = require('fs')
module.exports = {
    name: "addslashcommand",
    requiredPermission: "commands.addSlashCommand",
    useArgsObject: true,
    arguments: [
        {
            name: "json",
            type: "string"
        },
    ],
    async execute(message, args) {
        if (!stuff.slashCommands) stuff.slashCommands = {}
        console.log(args.json)
        var d = await message.client.api.applications['739191927647240301'].guilds[message.guild.id].commands.post({data: JSON.parse(args.json)})
        stuff.slashCommands[d.id] = d;
        await message.channel.send(`The command \`${d.name}\` has been added with an id of \`${d.id}\``)
    }
}
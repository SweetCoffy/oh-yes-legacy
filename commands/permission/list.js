const stuff = require("../../stuff")

module.exports = {
    name: "list",
    arguments: [
        {
            name: "role",
            type: "role",
            description: "The role to list permissions"
        },
    ],
    useArgsObject: true,
    onExecute(message, args) {
        var embed = {
            title: `Permission list: ${args.role.name}`,
            description: stuff.rolePermissions(args.role.id).map(el => `**${el}**`).join("\n") || "<nothing>",
            color: 0x0084ff,
        }
        message.channel.send({embed: embed})
    }
}
const stuff = require("../../stuff")

module.exports = {
    name: "remove",
    arguments: [
        {
            name: "role",
            type: "role",
            description: "The role to remove `permission` from"
        },
        {
            name: "permission",
            type: "string",
            description: "The permission to remove from `role`"
        }
    ],
    useArgsObject: true,
    requiredPermission: "commands.permission.remove",
    onExecute(message, args) {
        stuff.removeRolePermission(args.role.id, args.permission);
        var embed = {
            title: "Permission removed succesfully",
            color: 0x0084ff,
        }
        message.channel.send({embed: embed})
    }
}
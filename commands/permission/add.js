const stuff = require("../../stuff")

module.exports = {
    name: "add",
    arguments: [
        {
            name: "role",
            type: "role",
            description: "The role to add `permission` to"
        },
        {
            name: "permission",
            type: "string",
            description: "The permission to add to `role`"
        }
    ],
    useArgsObject: true,
    requiredPermission: "commands.permission.add",
    onExecute(message, args) {
        stuff.addRolePermission(args.role.id, args.permission);
        var embed = {
            title: "Permission added succesfully",
            color: 0x0084ff,
        }
        message.channel.send({embed: embed})
    }
}
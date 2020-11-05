const stuff = require("../stuff");

module.exports = {
    name: "has-permission",
    useArgsObject: true,
    arguments: [
        {
            name: "member",
            type: "member",
        },
        {
            name: "permission",
            type: "string"
        }
    ],
    execute(message, args) {
        var hasPermission = args.member.hasPermission(args.permission, {checkAdmin: true, checkOwner: true});
        if (hasPermission) message.channel.send(`${args.member.displayName} has the \`${stuff.thing(stuff.snakeToCamel(args.permission.toLowerCase()))}\` permission`);
    }
}
const stuff = require("../stuff")

module.exports = {
    name: "mass-unwarn",
    category: "moderation",
    requiredPermission: "mass-unwarn",
    useArgsObject: true,
    arguments: [
        {
            name: "user",
            type: "user"
        },
        {
            name: "count",
            type: "int"
        }
    ],
    execute(message, args) {
        var warns = stuff.db.data[args.user.id].warns;
        args.count = stuff.clamp(args.count, 1, 250);
        var removedCount = 0;
        if (args.count < warns.length) {
            for (var i = 0; i < args.count; i++) {
                if (warns.shift()) removedCount++;
            }
        } else {
            removedCount = warns.length;
            stuff.db.data[args.user.id].warns = [];
        }
        message.channel.send(`Removed ${removedCount} warns from ${args.user.username}`)
    }

}
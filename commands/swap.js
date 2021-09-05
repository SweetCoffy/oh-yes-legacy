var stuff = require('../stuff');
module.exports = {
    name: "swap",
    requiredPermission: "commands.swap",
    category: "abuse",
    useArgsObject: true,
    arguments: [
        {
            name: "target1",
            type: "user",
        },
        {
            name: "target2",
            type: "user",
        },
    ],
    execute(message, args) {
        var h1 = stuff.db.data[args.target2.id];
        var h2 = stuff.db.data[args.target1.id];
        stuff.db.data[args.target1.id] = h1;
        stuff.db.data[args.target2.id] = h2;
        return message.channel.send(`Swapped ${args.target1}'s data with ${args.target2}'s`)
    }
}
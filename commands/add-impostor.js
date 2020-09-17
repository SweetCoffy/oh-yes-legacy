module.exports = {
    name: "add-impostor",
    requiredPermission: "commands.add-impostor",

    execute (message, args) {
        var user = message.mentions.users.first();
        var client = message.client;

        

        if (!user) {
            user = { id: args[0]};
        }

        if (args.length < 1) {
            throw "***no***";
        }

        if (client.impostors.includes(user.id)) {
            throw "***no***";
        }

        client.impostors.push(user.id);
        message.delete();
    }
}
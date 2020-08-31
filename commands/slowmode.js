// slowmode command

module.exports = {
    name: "slowmode",
    usage: "slowmode <amount:number>",
    requiredPermission: "commands.slowmode",

    execute (message, args) {
        var num = parseFloat(args[0]);

        if (isNaN(num)) {
            throw "`amount` must be of type number";
        }

        message.channel.setRateLimitPerUser(num).then(() => {
            message.channel.send("lol");
        });
    }
}
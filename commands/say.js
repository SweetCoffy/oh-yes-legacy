module.exports = {
    name: "say",
    requiredPermission: "commands.say",
    usage: "say <text>",

    execute (message, args) {
        
        if (args.length < 1) {
            throw "***no***";
        }

        const txt = args.join(" ");

        message.channel.send(txt);
    }
}
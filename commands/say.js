module.exports = {
    name: "say",
    requiredPermission: "commands.say",
    usage: "say <text>",

    execute (message, args) {
        
        // questionable error message
        if (args.length < 1) {
            throw "not enough arguments";
        }

        // join the stuff
        const txt = args.join(" ");

        // actually sending the message
        message.channel.send(txt);
    }
}
// slowmode command

const stuff = require("../stuff")

module.exports = {
    name: "slowmode",
    usage: "slowmode <amount:number>",
    requiredPermission: "commands.slowmode",

    execute (message, args) {
        var num = parseFloat(args[0]);

        if (isNaN(num)) {
            throw "`amount` must be of type number";
        }

        num = stuff.clamp(num, 0, 21600);

        message.channel.setRateLimitPerUser(num).catch (error => {
            throw error;
        }).then(() => {
            message.channel.send("set slowmode of #" + message.channel.name + " to " + num.toFixed(1) + " seconds");
        })
            
        
    }
}
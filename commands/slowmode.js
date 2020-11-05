// slowmode command

const stuff = require("../stuff")
const RestrictedCommand = require('../RestrictedCommand')
var execute = (message, args) => {
    var num = parseFloat(args[0]);

    if (isNaN(num)) {
        throw "`amount` must be a number";
    }

    num = stuff.clamp(num, 0, 21600);

    message.channel.setRateLimitPerUser(num).catch (error => {
        throw error;
    }).then(() => {
        message.channel.send("set slowmode of #" + message.channel.name + " to " + num.toFixed(1) + " seconds");
    })
        
    
}
var cmd = new RestrictedCommand("slowmode", execute, "MANAGE_CHANNELS", "eggs")
module.exports = cmd;
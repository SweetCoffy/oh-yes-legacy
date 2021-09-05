const stuff = require("../stuff")
const RestrictedCommand = require('../RestrictedCommand')
var execute = (message, args) => {
    message.channel.setRateLimitPerUser(args.slowmode).catch (error => {
        stuff.sendError(message.channel, error)
    }).then(() => {
        message.channel.send(`Set slowmode of ${message.channel} to ${args.slowmode} seconds`);
    })
}
module.exports = new RestrictedCommand("slowmode", execute, "MANAGE_CHANNELS", "Changes the slowmode of the current channel").addArgumentObject({
    name: "slowmode",
    type: "number",
    optional: true,
    default: "0",
}).argsObject()
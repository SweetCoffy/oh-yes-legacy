const Command = require("../Command");
const SubcommandCommand = require("../SubcommandCommand");

module.exports = new SubcommandCommand('test', [
    new Command('h', message => message.channel.send(`${'h'.repeat(420 * Math.random())}`)),
    new Command('eggs', message => message.channel.send(`Eggs are gud.`)),
    new Command('argtest', (message, args) => {
        message.channel.send(`The number entered is **${args.h}**`);
    }).argsObject().addArgumentObject({
        name: "h",
        type: "number"
    })
])
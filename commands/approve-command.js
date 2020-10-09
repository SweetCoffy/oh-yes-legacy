const stuff = require("../stuff")

module.exports = {
    name: "approve-command",
    description: "approves a phone command to make it offical",
    usage: "approve-command <command>",
    execute(message, args) {
        stuff.approveCommand(args[0]);
        stuff.loadPhoneCommands();
        message.channel.send(`the command \`${args[0]}\` has been approved and the commands have been reloaded!!11!!11`);
    }
}
const Command = require("./Command");
// don't ask why it is unfinished
module.exports = class SubcommandCommand extends Command {
    execute (message, args) {
        var subcmd = args.shift();
        if (!subcmd) return;
    }
}
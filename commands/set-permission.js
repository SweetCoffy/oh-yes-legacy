
// vscode auto import stuff
// const { requiredPermission } = require("./say");
// const { execute } = require("./help");

// stuff script
const stuff = require('../stuff')

module.exports = {
    name: "set-permission",
    usage: "set-permission <userid:string> <permission:string> <value:bool>",
    description: "sets a permission",
    requiredPermission: "commands.setPermission",

    execute(message, args) {
        
        // another questionable error message
        if (args.length < 3) {
            throw "***no***";
        }

        // idk
        if (args[2] != "true" && args[2] != "false") {
            throw "invalid type";
        }
        
        
        // setting the permission
        stuff.setPermission(args[0], args[1], args[2]);

        // sending a message
        message.channel.send("set permission `" + args[1] + "` of `" + args[0] + "` to `" + args[2] + "`");


    }

}
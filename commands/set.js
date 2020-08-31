const stuff = require('../stuff')

module.exports = {
    name: "set",
    requiredPermission: "commands.set",

    usage: "set <setting:string> <value:any>",


    execute (message, args) {

        var val = args[1];
        
        if (args[1] == 'true') {
            val = true;
        } else if (args[1] == 'false') {
            val = false;
        }

        stuff.set(args[0], val);

        message.channel.send("set `" + args[0] + "` to `" + val + "`");

    }
}
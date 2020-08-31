const stuff = require('../stuff')

module.exports = {
    name: "set",
    requiredPermission: "commands.set",

    usage: "set <setting:string> <value:any>",


    execute (message, args) {

        if (args[1] == 'true') {
            stuff.set(args[0], true);
        } else if (args[1] == 'false') {
            stuff.set(args[0], false);
        }

    }
}
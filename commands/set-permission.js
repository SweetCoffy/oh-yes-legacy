
// vscode auto import stuff
// const { requiredPermission } = require("./say");
// const { execute } = require("./help");

// stuff script
const stuff = require('../stuff')

module.exports = {
    name: "set-permission",
    //usage: "set-permission <userid:string> <permission:string> <value:bool>",
    description: "sets a permission (oh yes permission system)",
    requiredPermission: "commands.set-permission",
    useArgsObject: true,
    arguments: [
        {
            name: "user",
            type: "user",
        },
        {
            name: "permission",
            type: "string",
        },
        {
            name: "value",
            type: "bool",
            optional: true,
            default: "true"
        }
    ],

    execute(message, args) {
        



        
        
        // setting the permission
        stuff.setPermission(args.user.id, args.permission, args.value);

        // sending a message
        message.channel.send({embed: {
            color: 0x4287f5,
            description: `Set permission ${args.permission} of user ${args.user.username} to **${args.value}**`
        }});


    }

}

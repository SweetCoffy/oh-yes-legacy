const stuff = require('../stuff');

module.exports = {
    name: "newport",
    description: "just like announce but for server ports",
    usage: "newport <game:string> <port:anyvalidportlollolol>",
    requiredPermission: "commands.newport",

    execute(message, args, extraArgs) {
        var game = args[0];
        var port = args[1];
        if (args.length < 2) throw "e";

        var game2embedTitle = {
            "terraria": "New terraria port",
            "minecraft": "New minecraft port"
        }
        
        var embed = {
            title: game2embedTitle[game] || "New port",
            color: 0x3679e3,
            description: port,
        }





        var channel = message.client.channels.cache.get(stuff.getConfig("server-info"));
        channel.send({embed: embed});
    }
}


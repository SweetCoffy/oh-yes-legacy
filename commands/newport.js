const stuff = require('../stuff');

module.exports = {
    name: "newport",
    description: "just like announce but for server ports",
    usage: "newport <Game> | <Port>",
    requiredPermission: "commands.newport",

    execute(message, args, extraArgs) {
        var newArgs = args.join(" ").trim().split("|")
        
        var game = newArgs[0];
        var port = newArgs[1];
        if (newArgs.length != 2) throw "Invalid command usage Here is the proper one: \nnewport <Game> | <Port>";

        var embed = {
            title: `New port for ${game}`,
            color: 0x3679e3,
            description: port,
        }





        var channel = message.client.channels.cache.get(stuff.getConfig("server-info"));
        channel.send({embed: embed});
    }
}


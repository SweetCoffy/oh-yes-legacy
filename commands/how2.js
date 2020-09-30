const stuff = require('../stuff');

module.exports = {
    name: "how2",
    description: "shows how 2 do some stuff with the bot",
    usage: "how2 <thing> --page='1'",

    execute (message, args, extraArgs) {
        if (args.length < 1) {
            var how2Names = [];
            var inBotChannel = message.channel.id == stuff.getConfig("botChannel");
            var currSeparator = ", ";

            if (inBotChannel) {
                currSeparator = "\n";
            }

            stuff.forEachHow2((k, v) => {
                if (!inBotChannel)
                how2Names.push(`\`${k}\``);
                if(inBotChannel)
                how2Names.push(`\`${k}\`: ${v[0].description.slice(0, 50)}...`);
            })
            
            var emb = {
                title: "how2 list",
                description: how2Names.join(currSeparator),
                footer: {
                    text: "use ;how2 <thing> for more info"
                }
            }

            message.channel.send({embed: emb})
            
            
            return;
        }
        
        
        
        var data = stuff.how2(args[0]);

        var page = 0;

        if (extraArgs[0] == "page") {
            page = (parseInt(extraArgs[1]) || 1) - 1;
        }

        var embed = data[page];

        if (embed.footer == undefined) {
            embed.footer = {text: `page ${page + 1}/${data.length}`}
        }

        message.channel.send({embed: embed});

    }
}
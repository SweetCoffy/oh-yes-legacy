module.exports = {
    name: "help",
    description: "shows command info",
    usage: "help [commandname]",

    execute (message, args) {
        const commands = message.client.commands;
        
        
        if (args[0]) {

            if (commands.has(args[0]) ) {

                const e = {
                    color: 0x00ff00,
                    title: args[0],
                    description: commands.get(args[0]).description || "<eggs>", 
                    fields: [
                        {
                            name: "usage",
                            value: commands.get(args[0]).usage || args[0],
                        }
                    ]
                }

                message.channel.send({embed: e});


            } else {
                throw "could not find command: `" + args[0] + "`";
            }


        } else {

            commandNames = [];

            commands.forEach(element => {
                commandNames.push("`" + (element.name || "invalid command") + "`");
            });

            message.channel.send(commandNames.join(", "));

        }
    }
}
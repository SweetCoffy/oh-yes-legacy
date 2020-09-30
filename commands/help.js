
// help command
const stuff = require('../stuff');

module.exports = {
    name: "help",
    description: "shows command info",
    usage: "help [commandname:string]",

    execute (message, args, extraArgs) {
        const commands = message.client.commands;
        
        
        // if the user specified a command, show info about it
        if (args[0]) {

            if (commands.has(args[0]) ) {

                var commandEnabled = stuff.getConfig("commands." + args[0].toLowerCase());
                var en;
                var commandRemoved = commands.get(args[0]).removed;

                if (commandEnabled && !commandRemoved) {
                    en = "🟩";
                } else {
                    en = "🟥";
                }
                
                var e = {
                    color: 0x00ff00,
                    title: args[0],
                    footer: {

                    }
                }

                if (commands.get(args[0]).removed) {
                    e.title = args[0] + " (removed)"
                }

                if (commandEnabled && !commandRemoved) {
                    e.footer.text = `${en} this command is enabled`
                } else if (!commandRemoved){
                    e.footer.text = `${en} this command is disabled`
                } else {
                    e.footer.text = `⬛ this command has been removed`;
                }



                if (commands.get(args[0]).usage || commands.get(args[0]).requiredPermission) {
                    e.fields = [];
                }

                if (commands.get(args[0]).usage) {
                    e.fields.push({name: "usage", value: commands.get(args[0]).usage})
                }

                if (commands.get(args[0]).requiredPermission) {
                    e.fields.push({name: "requires permission", value: commands.get(args[0]).requiredPermission})
                }

                if (commands.get(args[0]).description) {
                    e.description = commands.get(args[0]).description;
                }


                

                message.channel.send({embed: e});


            } else {
                throw "could not find command: `" + args[0] + "`";
            }


        } 
        // otherwise show a list of commands
        else {

            commandNames = [];



            var currSeparator = ", ";
            var inBotChannel = message.channel.id == stuff.getConfig("botChannel");
            var fancierMode = stuff.getConfig("fancierHelpMode");
            var showRemovedCommands = false;

            if (extraArgs[0] == "fancierMode") {
                fancierMode = true;
            }

            if (extraArgs[0] == "showRemoved") {
                showRemovedCommands = true;
            }

            if (inBotChannel) {
                currSeparator = "\n";
            }
            
            commands.forEach(element => {
                if (!inBotChannel) commandNames.push("`" + (element.name || "invalid command") + "`");
                if (inBotChannel) {
                    var commandRemoved = element.removed;
                    var commandEnabled = stuff.getConfig("commands." + element.name.toLowerCase());
                    var en;
    
                    if (commandEnabled && !commandRemoved) {
                        en = "\🟩";
                    } else if (!commandRemoved){
                        en = "\🟥";
                    } else {
                        en = "\⬛";
                    }
                    
                    if (!commandRemoved || showRemovedCommands) {
                        commandNames.push(`\`${en} ` + (element.name || "invalid command") + `\`: ` + (element.description || "<eggs>"));
                    }
                }
            });

            var embed = {
                title: "command list",
                description: commandNames.join(currSeparator),
                footer: {
                    text: 'use ;help <command name> for info about that command',
                }
            }

            if (inBotChannel) {
                if (fancierMode) {
                    embed.description = undefined;
                    embed.fields = [];
                    commands.forEach(element => {
                        var commandRemoved = element.removed;
                        var commandEnabled = stuff.getConfig("commands." + element.name.toLowerCase());
                        var en;
        
                        if (commandEnabled && !commandRemoved) {
                            en = "\🟩";
                        } else if (!commandRemoved){
                            en = "\🟥";
                        } else {
                            en = "\⬛";
                        }
                        if (!commandRemoved || showRemovedCommands) {
                            embed.fields.push(
                                {
                                    name: `\`${en}\` ` + element.name,
                                    value: element.description || "<eggs>",
                                    inline: true,
                                }
                            );
                        }
                        

                    })
                }
            }

            message.channel.send({embed: embed});

        }
    }
}
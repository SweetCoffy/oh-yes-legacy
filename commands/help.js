
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

                var cmd = commands.get(args[0]);
                
                if (commands.get(args[0]).removed) {
                    e.title = args[0] + " (removed)"
                }
                if (!stuff.getConfig(`commands.${cmd.name}`) && !cmd.removed) {
                    e.title = args[0] + " (disabled)"
                    
                }

 



                if (commands.get(args[0]).usage || commands.get(args[0]).requiredPermission) {
                    e.fields = [];
                }

                if (!cmd.removed && stuff.getConfig(`commands.${cmd.name}`)) {
                    e.color = 0x71ed18;
                } else if (!cmd.removed) {
                    e.color = 0xed2a18;
                } else {
                    e.color = 0x687a78;
                }

                if (commands.get(args[0]).usage) {
                    e.fields.push({name: "usage", value: commands.get(args[0]).usage})
                }

                e.fields.push({name: "cooldown", value: commands.get(args[0]).cooldown | 1 + `second(s)`})

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

            var page = 0;
            if (extraArgs[0] == "page") {
                page = (extraArgs[1] || 1) - 1
            }
            var startFrom = 0 + (20 * page);

            var embed = {
                title: "command list",
                description: commandNames.slice(startFrom, startFrom + 20).join(currSeparator),
                footer: {
                    text: `use ;help <command name> for info about that command, page ${page + 1}/${Math.ceil(commandNames.length / 20)}`,
                }
            }



            message.channel.send({embed: embed}).then(m => {
                m.react('◀️').then(r => r.message.react('▶️').then(r => r.message.react('🏓')))
            })

        }
    }
}

/*
       ----
       |  |
       |  |
       |  |
@Keanu |  |<----<
       |  |
       |  |
       |  |
       ----
*/
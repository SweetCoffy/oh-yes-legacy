
// help command
const stuff = require('../stuff');

module.exports = {
    name: "help",
    description: "shows command info",
    usage: "help [commandname:string]",

    execute (message, args, _extraArgs, extraArgs) {
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

 



                if (!e.fields) e.fields = [];
                
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

                if (commands.get(args[0]).usage && !cmd.arguments) {
                    e.fields.push({name: "Usage", value: commands.get(args[0]).usage})
                }
                if (cmd.arguments && !cmd.usage) {
                    e.fields.push({name: "Usage", value: args[0] + " " + cmd.arguments.map((el, i) => {
                        return `<${el.name || `arg${i}`}${el.optional ? "?" : ""} : ${el.validValues ? el.validValues.join("|") : el.type}>`   
                    }).join(" "), inline: true});
                }
                if (cmd.arguments) {
                    e.fields.push({
                        name: "Detailed usage",
                        value: cmd.arguments.map((el, i) => {
                            var str = `${el.name || "arg" + i}${el.optional ? "?" : ""} : ${el.type}${el.default ? ` = ${el.default}` : ''}`
                            return str;
                        }).join("\n"),
                        inline: true
                    })
                }

                if (cmd.requiredRolePermissions != undefined) {
                    e.fields.push({
                        name: "Requires role permission",
                        value: stuff.thing(stuff.snakeToCamel(cmd.requiredRolePermissions.toLowerCase()))
                    })
                }

                e.fields.push({name: "Cooldown", value: (cmd.cooldown | 1 ) + " second(s)"})

                if (commands.get(args[0]).requiredPermission) {
                    e.fields.push({name: "Requires permission", value: commands.get(args[0]).requiredPermission})
                }

                

                if (commands.get(args[0]).description) {
                    e.description = commands.get(args[0]).description;
                }


                if (e.fields.length < 1) delete e.fields;

                message.channel.send({embed: e});


            } else {
                throw "Could not find command `" + args[0] + "`";
            }


        } 
        // otherwise show a list of commands
        else {

            commandNames = [];



            var currSeparator = "\n";
            var showRemovedCommands = extraArgs.showRemoved;



          
            
            
            
            commands.forEach(element => {
                    var commandRemoved = element.removed;
                    var commandEnabled = stuff.getConfig("commands." + element.name.toLowerCase());
                    var en;
    
                    if (commandEnabled && !commandRemoved) {
                        en = "";
                    } else if (!commandRemoved){
                        en = "🔴";
                    } else {
                        en = "⚫";
                    }
                    
                    if (!commandRemoved || showRemovedCommands) {
                        commandNames.push(`${en} **` + (element.name || "invalid command") + `**: ` + (element.description || "<eggs>"));
                    }
                
            });

            var page = (extraArgs.page || 1) - 1;

            var startFrom = 0 + (20 * page);

            var embed = {
                title: "command list",
                description: commandNames.slice(startFrom, startFrom + 20).join(currSeparator),
                footer: {
                    text: `use ;help <command name> for info about that command, page ${page + 1}/${Math.ceil(commandNames.length / 20)}`,
                }
            }



            message.channel.send({embed: embed})

        }
    }
}


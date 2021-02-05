
// help command
const CommandError = require('../CommandError');
const stuff = require('../stuff');

module.exports = {
    name: "help",
    description: "shows command info",
    usage: "help [commandname:string]",

    async execute (message, args, _extraArgs, extraArgs) {
        const commands = message.client.commands;
        
        
        // if the user specified a command, show info about it
        if (args[0]) {

            if (commands.has(args[0]) ) {

                var cmd = commands.get(args[0]);
                if (args[1]) {
                    if (!cmd.subcommands) throw `The command \`${cmd.name}\` doesn't have any subcommands`
                    var subcmd = cmd.subcommands.get(args[1].toLowerCase())
                    if (!subcmd) throw `Invalid subcommand`
                    cmd = subcmd;
                }
                var commandEnabled = stuff.getConfig("commands." + cmd.name.toLowerCase());
                var en;
                var commandRemoved = cmd.removed;

                if (commandEnabled && !commandRemoved) {
                    en = "🟩";
                } else {
                    en = "🟥";
                }
                
                var e = {
                    color: 0x00ff00,
                    title: cmd.name,
                    footer: {

                    }
                }

                var subcmds = cmd.subcommands;


                if (cmd.removed) {
                    e.title = cmd.name + " (removed)"
                }
                if (!stuff.getConfig(`commands.${cmd.name}`) && !cmd.removed) {
                    e.title = cmd.name + " (disabled)"
                    
                }
                
                

                
                
                if (!e.fields) e.fields = [];
                if (cmd.usage || cmd.requiredPermission) {
                    e.fields = [];
                }
                if (subcmds) {
                    e.fields.push({
                        name: "Subcommands",
                        value: subcmds.map(el => `\`${el.name}\``).join(", "),
                        inline: true,
                    });
                }
                if (cmd.aliases) {
                    e.fields.push({ name: 'Aliases', inline: true, value: cmd.aliases.map(el => `\`${el}\``).join(', ')})
                }

                if (!cmd.removed && stuff.getConfig(`commands.${cmd.name}`)) {
                    e.color = 0x71ed18;
                } else if (!cmd.removed) {
                    e.color = 0xed2a18;
                } else {
                    e.color = 0x687a78;
                }
                if (cmd.usage && !cmd.arguments) {
                    e.fields.push({name: "Usage", value: cmd.usage})
                }
                if (cmd.arguments && !cmd.usage) {
                    e.fields.push({name: "Usage", value: (cmd.parent ? `${cmd.parent.name} ` : '') + cmd.name + " " + cmd.arguments.map((el, i) => {
                        return `<${el.name || `arg${i}`}${el.optional ? "?" : ""} : ${el.validValues ? el.validValues.join("|") : el.type}>`   
                    }).join(" "), inline: true});
                }
                if (cmd.arguments) {
                    e.fields.push({
                        name: "Detailed usage",
                        value: cmd.arguments.map((el, i) => {
                            var str = `**${el.name || "arg" + i}**${el.optional ? "?" : ""} : ${el.type}${el.default ? ` = ${el.default}` : ''}\n${el.description || '*<placeholder>*'}`
                            return str;
                        }).join("\n\n"),
                        inline: true
                    })
                }
                if (extraArgs.debug) {
                    e.fields.push({
                        name: "execute() function:",
                        value: `\`\`\`js\n${cmd.execute}\n\`\`\``
                    })
                }
                

                if (cmd.requiredRolePermissions != undefined) {
                    e.fields.push({
                        name: "Requires role permission",
                        value: stuff.thing(stuff.snakeToCamel(cmd.requiredRolePermissions.toLowerCase()))
                    })
                }

                e.fields.push({name: "Cooldown", value: (cmd.cooldown || 1 ) + " second(s)"})

                if (cmd.requiredPermission) {
                    e.fields.push({name: "Requires permission", value: cmd.requiredPermission})
                }

                

                if (cmd.description) {
                    e.description = cmd.description;
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
            // commandNames.slice(startFrom, startFrom + 20).join(currSeparator)
            var embed = {
                title: "command list",
                description: commandNames.slice(startFrom, startFrom + 20).join(currSeparator),
                footer: {
                    text: `Use ;help <command name> to see info about a command, page ${page + 1}`,
                }
            }



            var m = await message.channel.send({embed: embed})
            await m.react('⬅️')
            await m.react('➡️')
            await m.react('🚫')
            var collector = m.createReactionCollector((r, u) => !u.bot && u.id == message.author.id && ['⬅️','➡️','🚫'].includes(r.emoji.name), { time: 1000 * 120 })
            setTimeout(async () => {
                await m.react('⚠️')
            }, 1000 * 100)
            collector.on('collect', async (r, u) => {
                await r.users.remove(message.author.id)
                if (r.emoji.name == '⬅️') {page--;startFrom = 0 + (20 * page)}
                if (r.emoji.name == '➡️') {page++;startFrom = 0 + (20 * page)}
                if (r.emoji.name == '🚫') { message.delete();return m.delete() }
                embed.description = commandNames.slice(startFrom, startFrom + 20).join(currSeparator)
                embed.footer.text = `Use ;help <command name> to see info about a command, page ${page + 1}`
                m.edit({embed: embed})
            }).on('end', () => {
                m.delete()
            })

        }
    }
}


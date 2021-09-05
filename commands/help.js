
// help command
const { MessageActionRow, MessageButton, Message } = require('discord.js');
const CommandError = require('../CommandError');
const stuff = require('../stuff');

module.exports = {
    name: "help",
    description: "shows command info",
    supportsQuoteArgs: true,
    useArgsObject: true,
    category: "help",
    arguments: [{
        name: "command_or_category",
        type: "string",
        optional: true,
        default: "",
    }],
    /**
     * 
     * @param {Message} message 
     * @param {*} args 
     * @param {*} _extraArgs 
     * @param {*} extraArgs 
     */
    async execute (message, args, _extraArgs, extraArgs) {
        var cmd = args.command_or_category
        var forceCat = false;
        if (cmd.startsWith("!")) {
            forceCat = true;
            cmd = cmd.slice(1)
        }
        var commands = message.client.commandCategories.get(cmd);
        if (cmd == "ALL") commands = message.client.commands
        // if the user specified a command, show info about it
        if (message.client.commands.has(cmd) && !forceCat) {

            if (message.client.commands.has(cmd) ) {

                var cmd = message.client.commands.get(cmd);
                /*if (args[1]) {
                    if (!cmd.subcommands) throw `The command \`${cmd.name}\` doesn't have any subcommands`
                    var subcmd = cmd.subcommands.get(args[1].toLowerCase())
                    if (!subcmd) throw `Invalid subcommand`
                    cmd = subcmd;
                }*/
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
                        name: "Parameters",
                        value: cmd.arguments.map((el, i) => {
                            var str = `${el.type}${el.optional ? "?" : ""} **${el.name || "arg" + i}**${el.default ? ` = ${el.default}` : ''}\n${el.description || 'nothing'}`
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
                throw `Could not find command: ${cmd}`;
            }


        } 
        // otherwise show a list of commands
        else if (!cmd) {
            commandNames = [];
            var currSeparator = "\n";
            var showRemovedCommands = extraArgs.showRemoved;
            var page = (extraArgs.page || 1) - 1;
            var startFrom = 0 + (20 * page);
            var embed = {
                title: 'Command categories',
                description: message.client.commandCategories.map((v, k) => `\`${k}\` (${v.size} commands)`).join("\n"),
                footer: { text: `Use ;help <category name> to show the command list of that category` }
            }
            var m = await message.channel.send({embed: embed})
            /*
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
            */
        } else if (cmd) {
            if (!commands) throw `Invalid category`
            var page = 0;
            var pageSize = 20
            var m = await message.reply({embeds: [{ description: "Doing ur mom..." }]})
            async function update() {
                var max = Math.ceil(commands.size / pageSize)
                if (page >= max) {
                    page = 0;
                }
                if (page < 0) page = max - 1;
                var startFrom = page * pageSize;
                var endAt = startFrom + pageSize;
                var embed = {
                    title: `Category command list: ${cmd}`,
                    description: commands.map(el => 
                        `\`${el.name}${el.arguments ? ` ${el.arguments.map(el => el.optional ? `[${el.name}]` : `<${el.name}>`).join(" ")}` : ""}\`: ${el.description}`)
                        .slice(startFrom, endAt)
                        .join("\n"),
                    footer: { text: `Page: ${page + 1}/${max}` }
                }
                await m.edit({embed: embed, components: [new MessageActionRow(
                    { components: [
                        new MessageButton({ emoji: "◀️", customId: "prev", style: "PRIMARY" }),
                        new MessageButton({ emoji: "▶️", customId: "next", style: "PRIMARY" }),
                        new MessageButton({ emoji: "❌", customId: "close", style: "DANGER" }),
                    ] }
                )]})
                var i = await m.awaitMessageComponent({ filter: (i) => {
                    if (i.user.id != message.author.id) {
                        i.reply({ content: "no", ephemeral: true })
                        return false
                    }
                    return true;
                } })
                if (i.customId == "prev") {
                    page--;
                } else if (i.customId == "next") {
                    page++;
                } else if (i.customId == "close") {
                    await m.delete()
                    await i.reply({content: "delete moment", ephemeral: true})
                    await message.delete()
                    return;
                }
                await i.deferUpdate()
                await update()
            }
            await update()
        }
    }
}


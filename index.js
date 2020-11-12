const Discord = require('discord.js');
const stuff = require('./stuff');
const client = new Discord.Client();
stuff.client = client;
client.commands = new Discord.Collection();
client.requiredVotes = 10;
client.voteTimeout = 100;
const chalk = require('chalk')
if (!stuff.globalData.exists(`/banned`)) {
    stuff.globalData.push(`/banned`, [])
}
const config = require('../config.json');
const fs = require('fs');
const CommandError = require('./CommandError');
function messageThing(message) {
    var cname = message.channel.name;
    var uname = message.author.username;
    var c = message.content;
    var fancyContent = c.replace(/`([^`]+)`/gs, chalk.bgHex("121212")("$1"))
    .replace(/\*(.+)\*/gs, chalk.italic("$1"))
    .replace(/\*\*(.+)\*\*/gs, chalk.bold("$1"))
    .replace(/~~(.+)~~/, chalk.strikethrough("$1"))
    
    var embed = message.embeds[0];
    if (embed) {
        fancyContent += `\n${chalk.bgHex(embed.hexColor || "121212")("---------------------------------------")}\n${chalk.whiteBright(embed.title || "")}\n${(embed.description || "").replace(/\*\*([^*]+)\*\*/g, chalk.bold("$1"))}\n${chalk.gray(embed.fields.map(el => `\t${chalk.whiteBright(el.name)}\n\t${chalk.gray(el.value)}`).join("\n\n"))}\n${chalk.gray((embed.footer || {}).text || "")}\n${chalk.bgHex(embed.hexColor || "121212")("---------------------------------------")}`
    }
    console.log(`${chalk.gray(cname + "/")}${uname}${chalk.gray(":")} ${fancyContent}`)
}
const { resolve, join } = require('path');
const api = require('./api');
const cooldowns = new Discord.Collection();
const h = {
    get auditLogs() {
        return client.channels.cache.get(stuff.getConfig("auditLogs"))
    }
}
function loadCommands() {
    var totalLines = 0;
    console.log('Loading commands...')
    var i = 0;
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        delete require.cache[resolve(`./commands/${file}.js`)]
        const command = require(`./commands/${file}`);
        var hh = fs.readFileSync('commands/' + file, 'utf8')
        totalLines += hh.split(/\r\n|\r|\n/).length;
        client.commands.set(command.name, command);
        console.log(`Loaded '${file}' as '${command.name}', ${i + 1}/${commandFiles.length}`);
        i++;
    }
    console.log(`Finished loading commands, ${totalLines} lines of code loaded`)
    stuff.loadPhoneCommands();
}
loadCommands();
stuff.loadCommands = loadCommands;
client.once('ready', () => {
    console.log('oh yes');
    api.init(client);
    Object.entries(stuff.shopItems).forEach(([k, v]) => {
        stuff.originalPrices[k] = v.price || 0;
    })
    client.taxInterval = setInterval(() => {
        try {
            stuff.forEachUser((id, data) => {
                data.taxes.forEach(el => {
                    stuff.addPoints(id, -el.amount * (data.multiplier * el.multiplierEffect) / 60)
                })
            })
        } catch (e) {}
    }, 1000 * 60)
    stuff.updateVenezuelaMode();
});
function sendAuditLog(message) {
    var embed = {fields: []}
    embed.title = "Message deleted";
    embed.description = message.content;
    embed.author = {
        name: message.author.username,
        icon: message.author.avatarURL()
    }
    if (embed.fields.length < 1) delete embed.fields;
    h.auditLogs.send({embed: embed})
}
client.on('messageDelete', async message => {
    try {
        sendAuditLog(message)
        client.lastDeleted = message;
    } catch (err) {}
})
client.on('messageUpdate', (_message, message) => {
    try {
        if ((_message.content == message.content) || _message.embeds == message.embeds) return;
        messageThing(message)
    } catch (err) {
        console.log(err);
    }
})
client.on('messageReactionAdd', (reaction, user) => {
    try {
        if (stuff.db.getData(`/banned`).includes(user.id)) return;
        if (stuff.getConfig("randomReactions") && message.author.id != '676696728065277992') reaction.message.react(reaction.emoji.id);
        var author = reaction.message.author.id
        var message = reaction.message
        if (user.id == author) return
        if (reaction.emoji.id == stuff.getConfig("v_")) {
            stuff.addPoints(author, 10 * Math.random() * stuff.getMultiplier(author, false)); 
            stuff.addVCounter(user.id, 1);
        } else if (reaction.emoji.id == stuff.getConfig("ohyes")) {
            stuff.addPoints(author, -0.5 * Math.random());        
        } else if (reaction.emoji.id == stuff.getConfig("ohno")) {
            stuff.addPoints(author, 3 * Math.random() * stuff.getMultiplier(author, false));
        } else if (reaction.emoji.id == stuff.getConfig("oO")) {
            stuff.addPoints(author, 7.5 * Math.random() * stuff.getMultiplier(author, false));
        } else if (reaction.emoji.id == stuff.getConfig("deepfriedv_")) {
            stuff.addPoints(author, 5 * Math.random() * stuff.getMultiplier(author, false));
        } else if (reaction.emoji.id == stuff.getConfig("madv_")) {
            stuff.addPoints(author, 9 * Math.random() * stuff.getMultiplier(author, false));
        }        
    } catch (err) {}  
})

client.on('emojiUpdate', async (oldEmoji, newEmoji) => {
    try {        
        if (newEmoji.roles.cache.size > 0 && newEmoji.id == "755546914715336765") {
            await newEmoji.edit({roles: []})
            await client.channels.cache.get(stuff.getConfig("reportsChannel")).send(`Some evil person whitelisted <:v_:755546914715336765>`)
        }
    } catch (e) {}
})
client.on('emojiDelete', async emoji => {
    try {
        var channel = client.channels.cache.get(stuff.getConfig("reportsChannel"));
        await channel.send(`<@&768569677001523220> Emoji Yeet Alert: ${emoji.name} was yeeted!`)
    } catch (e) {}
})

client.on('message', async message => {
    try {
        var hasData = false;
        var u = message.author.id;
        if (stuff.userHealth[message.author.id] == undefined) {
            stuff.userHealth[message.author.id] = stuff.getMaxHealth(message.author.id);
        }
        try {
            stuff.db.getData(`/${message.author.id}/permissions`);
            hasData = true;
        } catch (er) {
            hasData = false;
        }
        if (!hasData) {
            stuff.db.push(`/${message.author.id}`, {
                permissions: {},
                multiplier: 1,
                points: 0,
                defense: 0,
                maxHealth: 100,
                gold: 0,
                taxes: [],
                inventory: [],
                pets: [],
            });
        }
        stuff.addTax(message.author.id, 'existing');
        if (message.channel.type == 'dm') return;
        if (stuff.globalData.getData(`/banned`).includes(message.author.id)) return;
        if((message.content.includes("egg") || message.content.includes("🥚")) && message.author.id != client.user.id && message.author.id != '676696728065277992') {
            message.react('🥚');
        }
        if (message.content.includes("<:v_:755546914715336765>")) {
        stuff.addVCounter(message.author.id, 1);
    }
    if (message.channel.id == stuff.getConfig("botChannel") && stuff.currentBoss) {
        client.user.setPresence({
            status: "online",
            activity: {
                name: `${stuff.currentBoss.name}: ${stuff.format(stuff.currentBoss.health)}/${stuff.format(stuff.currentBoss.maxHealth)}`,
                type: "PLAYING",
            }
        })
    } else if (message.channel.id == stuff.getConfig("botChannel")) {
        client.user.setPresence({
            status: "online",
            activity: {
                name: `No bosses currently active`,
                type: "PLAYING"
            }
        })
    }
    if (stuff.getConfig("randomReactions") && message.author.id != '676696728065277992') {
        try {
            if (message.content.includes("v_")) {
                var emojis = stuff.getConfig("idk");
                message.react(emojis[Math.floor(Math.random() * emojis.length)])
            } else if (Math.random() < stuff.getConfig("vChance")) {
                var emojis = stuff.getConfig("idk");
                message.react(emojis[Math.floor(Math.random() * emojis.length)])
            }
            var regex = /<:\w+:(\d+)>|:(\w+):/g
            var matches = message.content.matchAll(regex);
            var promises = [];
            for (const match of matches) {
                var c = match.slice(1).filter(el => el);
                promises.push(message.react(c[0]))
            }
            Promise.all(promises).catch(e => console.log(e))
        } catch (_e) {}
    }
    messageThing(message)
    if (!stuff.db.exists(`/${message.author.id}/pets`)) {
        stuff.db.push(`/${message.author.id}/pets`, []);
    }
    if (!stuff.db.exists(`/${message.author.id}/defense`)) {
        stuff.db.push(`/${message.author.id}/defense`, 0);
    }
    if (!stuff.db.exists(`/${message.author.id}/gold`)) {
        stuff.db.push(`/${message.author.id}/gold`, 0);
    }
    if (stuff.getPoints(message.author.id) > 1000000000000000000) {
        stuff.addAchievement(message.author.id, {
            id: "stonks:omega",
            name: "Omega Stonks",
            description: `Get more than ${stuff.format(1000000000000000000)} Internet Points`
        })
        stuff.addTax(message.author.id, 'omegaStonks')
        stuff.addMedal(message.author.id, stuff.medals['omega-stonks']);
    }
    if (stuff.getMaxHealth(u) > 1000000) {
        stuff.db.push(`/${u}/maxHealth`, 1000000);
        stuff.userHealth[u] = 1000000;
    }
} catch (e) {sendError(message.channel, e)}
   if (message.author.bot && message.author.id != config.ohnoId)
   return;
   var user = message.mentions.users.first();
   if (user) {
       if (user.id == client.user.id) {
           message.react('729900329440772137');
           message.channel.send({content: message.author.toString(), embed: {
               title: "get ponged",
               description: `i have **${client.commands.size}** commands, use \`;help\` for a list of commands`
           }}).then(m => m.delete({timeout: 10000}))
       }
   }
    try {stuff.addPoints(message.author.id, 0.5 * Math.random() * stuff.clamp(message.content.length, 0.5 * Math.random(), 2000 * Math.random()), 1, 500 * stuff.getMultiplier(message.author.id, false));}
    catch (err) {console.log(err)}
    try {
        if (message.author.id != '676696728065277992') {
            var r = /^(h+)(?!.)/g
            if (r.test(message.content)) {
                var h = message.content.replace(r, "$1$1");
                if (h.length > 2000) {
                    h = { content: h.slice(0, 2000), embed: { description: h.slice(2000, 4048), footer: { text: "you thought you could beat me this time you e" } }}
                }
                message.channel.send(h)
            }
        }
    } catch (err) {console.log(err)}
    var prefix = (message.channel.id == stuff.getConfig("noPrefixChannel")) ? "" : config.prefix;
    if (!message.content.startsWith(prefix)) return;
    var now = Date.now();
    var args = message.content.slice(prefix.length).split(" ");
    const commandName = args.shift();;
    const command = client.commands.get(commandName) ?? client.commands.filter(v => {
        if (!v.aliases) return
        if (v.aliases.includes(commandName)) return true
    }).first();
    if (!command) return;
    try {
        if (stuff.getPermission(message.author.id, command.requiredPermission) || command.requiredPermission == undefined || stuff.getPermission(message.author.id, "*")) {
            if (stuff.getConfig("commands." + command.name)) {
                if (command.removed) throw "this command has been removed, but not entirely (maybe it will come back if <@602651056320675840> wants to)";
                if (!cooldowns.has(command.name)) {
                    cooldowns.set(command.name, new Discord.Collection())
                }
                var now = Date.now();
                const timestamps = cooldowns.get(command.name)
                const cooldownAmount = (command.cooldown || 1) * 1000;
                if (timestamps.has(message.author.id)) {
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                    if (now < expirationTime) return;    
                } else {
                    timestamps.set(message.author.id, now);
                    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                }
                var joinedArgs = args.join(" ");
                var regex = /--([^-\s]+)='([^']+)'|--([^-\s]+) "([^']+)"|--([^-\s]+) ([^-'\s]+)|--([^-\s]+) '([^']+)'|--([^-\s]+)/gm
                var extraArgsObject = {};
                var _matches = joinedArgs.matchAll(regex);
                for (const match of _matches) {
                    var filteredMatch = match.filter(el => el != "" && el != " " && el != undefined)
                    extraArgsObject[filteredMatch[1]] = filteredMatch[2] || true;
                } 
                var matches = (regex.exec(joinedArgs) || []).filter(function(el) {
                    return el != "" && el != null && el != undefined;
                });     
                var extraArgs = (matches || []).slice(1, 3) || [];
                joinedArgs = joinedArgs.replace(regex, "");
                var newArgs = joinedArgs.split(" ").filter(function(el) {
                    return el != "" && el != null && el != undefined;
                }) || [];
                var a = [];
                if (command.arguments) {
                    a = stuff.argsThing(command, newArgs, message)
                } else {
                    a = newArgs
                }
                command.execute(message, a, extraArgs, extraArgsObject);
            } else{
                throw `The command \`${command.name}\` is disabled, run \`;set commands.${command.name} true\` to re-enable it`;
            }
        } else throw new CommandError(`Missing Permissions`, `The command \`${command.name}\` requires the \`${command.requiredPermission}\` permission`)
        var actualNow = Date.now();
        console.log(`Took ${actualNow - now}ms to process a command`);
    } catch (error) {
        sendError(message.channel, error);
        message.react("755546914715336765")
        
    }
});
function sendError (channel, err) {
    var _err = err;
    if (typeof err == 'string') {
        _err = CommandError.fromString(err);
    } 
    var msgEmbed = {
        color: 0xff0000,
        title: _err.name || "oof",
        description: _err.message || _err.toString(),
    }
    if (_err.stack) {
        msgEmbed.fields = [
            {
                name: "Stack Trace",
                value: _err.stack
            }
        ]
    }
    if (_err.footer) {
        msgEmbed.footer = {text: _err.footer}
    }
    channel.send({embed: msgEmbed});
}
client.login(config.token);


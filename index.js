const Discord = require('discord.js');
const stuff = require('./stuff');
stuff.db.load()
const client = new Discord.Client();
var collecting = false;
var result = "";
stuff.client = client;
client.commands = new Discord.Collection();
client.requiredVotes = 10;
client.voteTimeout = 100;
client.slashCommands = new Discord.Collection();
const chalk = require('chalk')
if (!stuff.dataStuff.exists(`/banned`)) {
    stuff.dataStuff.push(`/banned`, [])
}
const config = require('../config.json');
const fs = require('fs');
const CommandError = require('./CommandError');
function messageThing(message) {

    
}
const { resolve, join } = require('path');
const { counter } = require('./stuff');
const cooldowns = new Discord.Collection();
const h = {
    get auditLogs() {
        return client.channels.cache.get(stuff.getConfig("auditLogs"))
    }
}
async function loadSlashCommands() {
    console.log(`Loading slash commands...`)
    client.slashCommands.clear();
    var app = await client.app
    app
    const commandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        delete require.cache[resolve(`./slashCommands/${file}`)]
        const command = require(`./slashCommands/${file}`);
        client.slashCommands.set(command.name, command);
    }
}
async function loadCommands() {
    console.log('Loading commands...')
    client.commands.clear()
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        delete require.cache[resolve(`./commands/${file}`)]
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
    loadSlashCommands()
    console.log(`Finished loading commands`)
    stuff.loadPhoneCommands();
}
stuff.loadSlashCommands = loadSlashCommands
stuff.loadContent()
stuff.updateContent()
loadCommands();
stuff.loadCommands = loadCommands;
client.once('ready', async () => {
    console.log('oh yes');
    Object.entries(stuff.shopItems).forEach(([k, v]) => {
        stuff.originalPrices[k] = v.price || 0;
    })
    client.taxInterval = setInterval(() => {
        try {
            stuff.forEachUser((id, data) => {
                data.taxes.forEach(el => {
                    var hasReverseCard = stuff.getInventory(id).map(el => el.id).includes('reverse-card');
                    var a = -el.amount * (data.multiplier * el.multiplierEffect) / 60
                    stuff.addPoints(id, hasReverseCard ? -a : a, `${el.name}`)
                })
            })
        } catch (e) {console.log(e)}
    }, 1000 * 60)
    client.backupInterval = setInterval(() => {
        try {
            stuff.backup();
        } catch (e) {console.log(e)}
    }, stuff.getConfig('backupInterval'))
    stuff.updateVenezuelaMode();
    var stonksThing = () => {
        stuff.updateStonks()
        client.stonksTimeout = setTimeout(stonksThing, stuff.getConfig('stonkUpdateInterval'))
    }
    stonksThing()
});
client.on('messageReactionAdd', (reaction, user) => {
    try {
        var message = reaction.message    
        if (stuff.db.getData(`/banned`).includes(user.id)) return;
        if (stuff.getConfig("randomReactions") && message.author.id != '676696728065277992') reaction.message.react(reaction.emoji.id);
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
    var now = Date.now();
    try {
        try {stuff.db.save()} catch (_er) {console.log(_er)}
        if (message.channel.id == stuff.getConfig("countingChannel") && !message.author.bot) {
            var match = message.content.match(/(\d+)\s*[^]*/) || [];
            if (match[1] == stuff.counter + 1) {
                stuff.counter++;
                var h = Math.floor(stuff.counter / 10)
                if (h == stuff.counter / 10) {
                    message.channel.setTopic(`Current count: ~${h * 10}`)
                }
                if (match[1].includes("69")) {
                    message.channel.setTopic(`Current count: ~${stuff.counter}`)
                    message.channel.send("nice");
                    message.react("<:oO:749319330503852084>");
                    var pinned = [...message.channel.messages.cache.filter(el => el.pinned).values()]
                    message.pin();
                    if (pinned.length >= 50) {
                        await pinned[0].unpin();
                    }
                }
            } else {
                message.delete();
            }
        }
        if (collecting && !message.author.bot) {
            result += " " + message.content;
        }
        if (result.length >= 2000) {
            if (result.length > 1) {
                result = result.trim().slice(0, 1997);
                message.channel.send(`"${result}"`);
            }
            result = "";
        }
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
                points: 3000,
                defense: 0,
                maxHealth: 100,
                gold: 0,
                maxItems: 65536,
                taxes: [],
                inventory: [],
                pets: [],
            });
        }
        stuff.addTax(message.author.id, 'existing');
        if (message.channel.type == 'dm') return;
        if (stuff.dataStuff.getData(`/banned`).includes(message.author.id)) return;
        if((message.content.includes("egg") || message.content.includes("🥚")) && message.author.id != client.user.id && message.author.id != '676696728065277992' && stuff.getConfig('randomReactions')) {
            message.react('🥚');
        }
        if (message.content.includes("<:v_:755546914715336765>")) {
        stuff.addVCounter(message.author.id, 1);
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
                if (!stuff.getEmoji(c[0]).name) stuff.dataStuff.push(`/emoji/${c[0]}/name`, c[1])
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
    if (stuff.getMaxHealth(u) > 100000000) {
        stuff.db.push(`/${u}/maxHealth`, 100000000);
        stuff.userHealth[u] = 100000000;
    }
    var eastereggs = Object.values(stuff.eastereggs)
    for (const e of eastereggs) {
        if (e.triggerCheck(message)) e.onTrigger(message)
    }
    var cheats = Object.entries(stuff.getCheats(message.author.id))
    for (const e of cheats) {
        if (e[1] && stuff.cheats[e[0]]) {
            stuff.cheats[e[0]].onMessage(message)
        } 
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
               color: 0x2244ff,
               description: `i have **${client.commands.size}** commands, use \`;help\` for a list of commands`
           }}).then(m => m.delete({timeout: 10000}))
       }
   }
    var prefix = (message.channel.id == stuff.getConfig("noPrefixChannel")) ? "" : stuff.getConfig('prefix', ';');
    if (!message.content.startsWith(prefix)) return;
    var args = message.content.slice(prefix.length).split(" ");
    const commandName = args.shift();
    const command = client.commands.get(commandName) ?? client.commands.filter(v => {
        if (!v.aliases) return
        if (v.aliases.includes(commandName)) return true
    }).first();
    if (!command) return;
    try {
        if (!command.usableAnywhere && stuff.getConfig('botChannel', undefined)) {
            if (message.channel.id != stuff.getConfig('botChannel', undefined)) throw `imagine using bots outside of <#${stuff.getConfig('botChannel', undefined)}>`
        }
        if (stuff.getPermission(message.author.id, command.requiredPermission, message.guild.id) || !command.requiredPermission || stuff.getPermission(message.author.id, "*", message.guild.id)) {
            if (stuff.getConfig("commands." + command.name) || command.usableAnytime) {
                if (command.removed) throw "this command has been removed, but not entirely (maybe it will come back if <@602651056320675840> wants to)";
                if (!cooldowns.has(command.name)) {
                    cooldowns.set(command.name, new Discord.Collection())
                }
                var now = Date.now();
                const timestamps = cooldowns.get(command.name)
                const cooldownAmount = (command.cooldown || 1) * 1000;
                if (timestamps.has(message.author.id)) {
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                    if (now < expirationTime) {
                        if (command.cooldown > 6) throw `Cooldown exists, ${((expirationTime - now) / 1000).toFixed(1)} seconds left`
                        return
                    };    
                } else {
                    timestamps.set(message.author.id, now);
                    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                }
                var joinedArgs = args.join(" ");
                var regex = /--(\w+) ?("([^-]*)")?/gm
                var extraArgsObject = {};
                var _matches = joinedArgs.matchAll(regex);
                for (const match of _matches) {
                    extraArgsObject[match[1]] = match[3] || true;
                } 
                var matches = (regex.exec(joinedArgs) || []).filter(function(el) {
                    return el != "" && el != null && el != undefined;
                });     
                var extraArgs = (matches || []).slice(1, 3) || [];
                joinedArgs = joinedArgs.replace(regex, "");
                var newArgs = joinedArgs.split(" ").filter(function(el) {
                    return el != "" && el != null && el != undefined;
                }) || [];
                var r = /"([^"]+?)"|([^ ]+)/g
                if (command.supportsQuoteArgs) {
                    newArgs = [...newArgs.join(" ").matchAll(r)].map(el => el[1] || el[2])
                }
                var a = [];
                if (command.arguments) {
                    a = stuff.argsThing(command, newArgs, message)
                    var required = command.arguments.filter(el => !el.optional)
                    Object.entries(extraArgsObject).forEach(([k, v]) => {
                        var arg = command.arguments[command.arguments.map(el => el.name).indexOf(k)]
                        console.log(arg)
                        if (arg) {
                            a[k] = stuff.argConversion(arg, v, message)
                            a["_" + k] = v
                        }
                    })
                    console.log(a)
                    var argArray = Object.entries(a)
                    argArray.forEach(([k, v]) => {
                        console.log(k + ": " + v)
                        if (k.startsWith("_")) return;
                        if (v == undefined) throw `Invalid usage`
                    })
                    if (argArray.length < required) {
                        throw `Required argument \`${command.arguments[argArray.length].name}\` is missing`
                    }
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
    console.log(err)
    if (typeof err == 'string') {
        _err = CommandError.fromString(err);
    } 
    var msgEmbed = {
        color: 0xff0000,
        thumbnail: { url: 'https://cdn.discordapp.com/emojis/737474912666648688.png?v=1' },
        title: _err.name || "oof",
        description: _err.message || _err.toString(),
    }
    if (_err.stack) {
        msgEmbed.fields = [{name: `Stack Trace`, value: _err.stack.slice(0, 1024)}]
    }
    if (_err.footer) {
        msgEmbed.footer = { text: _err.footer }
    }
    channel.send({embed: msgEmbed});
}
stuff.sendError = sendError;
client.login(config.token);


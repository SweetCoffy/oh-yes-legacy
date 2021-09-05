const Discord = require('discord.js');
const fs = require('fs');
const stuff = require('./stuff');
stuff.db.load()
const client = new Discord.Client({ intents: 32767 });
var collecting = false;
var result = "";
var snipeStream = require('fs').createWriteStream("F:/snipe-log.txt")
var snipeLog = new ((require('console')).Console)(snipeStream, snipeStream)
stuff.client = client;
client.commands = new Discord.Collection();
client.commandCategories = new Discord.Collection();
client.requiredVotes = 10;
client.voteTimeout = 100;
client.snipeLimit = 500;
client.slashCommands = new Discord.Collection();
client.snipe = [];
var u = JSON.parse(fs.readFileSync("command-usage.json", 'utf8'))
stuff.commandUsage = u;
const DEBUG_GUILDS = ["758128084632600596", "728718708079460424"]
const chalk = require('chalk')
if (!stuff.dataStuff.exists(`/banned`)) {
    stuff.dataStuff.push(`/banned`, [])
}
const config = require('../config.json');
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
    const commandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));
    var p = []
    var g = await Promise.all(DEBUG_GUILDS.map(el => client.guilds.fetch(el)))
    for (const file of commandFiles) {
        delete require.cache[resolve(`./slashCommands/${file}`)]
        const command = require(`./slashCommands/${file}`);
        client.slashCommands.set(command.name, command);
        p.push(...g.map(g => g.commands.create(command)))
    }
    return Promise.all(p)
}
function addSnipe(m) {
    client.snipe.unshift({
        content: m.content,
        embeds: {...m.embeds},
        author: m.author,
        member: m.member,
        message: m,
    })
    if (client.snipe.length > client.snipeLimit) client.snipe.pop();
    snipeLog.log(`(snipe) ${m.guild.name}>${m.channel.name}>${m.author.tag}: ${m.content || "N/A"}`)
}
client.on("messageDelete", (m) => {
    addSnipe(m);
})
client.on("messageUpdate", (msg) => {
    addSnipe(msg);
})
process.on("uncaughtException", (er) => {
    console.log(er)
})
process.on("unhandledRejection", (r) => {
    console.log(r)
})
function loadCommands() {
    client.commandCategories = new Discord.Collection();
    console.log('Loading commands...')
    client.commands.clear()
    var er = {}
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        delete require.cache[resolve(`./commands/${file}`)]
        try {
            const command = require(`./commands/${file}`);
            if (!client.commandCategories.get(command.category || "commands")) client.commandCategories.set(command.category || "commands", new Discord.Collection());
            client.commandCategories.get(command.category || "commands").set(command.name, command)
            client.commands.set(command.name, command);
        } catch (e) {
            er[file] = e
            console.log(e)
        }
    }
    console.log(`Finished loading commands`)
    stuff.loadPhoneCommands();
    return er;
}
stuff.currencies = new Proxy(stuff._currencies, {
    get: function(target, key) {
        if (!target[key]) {
            return {...target.unknown, name: `Invalid currency ${key}`, propertyName: `unknown$${key}`}
        } else {
            return target[key];
        }
    },
    set(target, k, v) {
        return target[k] = v;
    }
}),
stuff.loadSlashCommands = loadSlashCommands
stuff.loadContent()
stuff.updateContent()
loadCommands();
stuff.loadCommands = loadCommands;
client.once('ready', async () => {
    console.log('oh yes');
    loadSlashCommands()
    try {
        var c = fs.readFileSync("prev-channel.txt", "utf8")
        client.channels.fetch(c).then(c => {
            c.send(`Restart'd`)
            fs.unlinkSync("prev-channel.txt")
        }).catch(er => console.log(er))
        Object.entries(stuff.shopItems).forEach(([k, v]) => {
            stuff.originalPrices[k] = v.price || 0;
        })
    } catch (er) {}
    client.taxInterval = setInterval(() => {
        try {
            stuff.forEachUser((id, data) => {
                data.taxes.forEach(el => {
                    var a = (el.amount * (data.multiplier * el.multiplierEffect)) / 60
                    stuff.addPoints(id, -a, `${el.name}`)
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
var usage = u;
client.on('channelCreate', (c) => {
    if (c.isThread()) {
        c.join()
    }
})
function inccmd(type, cmd) {
    if (!u[type].TOTAL) u[type].TOTAL = 0;
    if (!u[type][cmd]) u[type][cmd] = 0;
    u[type][cmd]++
    u[type].TOTAL++
    u.total++
}
client.on('interactionCreate', async(i) => {
    console.log(`Interaction: ${i.user.tag} ${i.constructor.name} ${i.commandName} ${i.type}`)
    if (!i.isCommand() && !i.isContextMenu()) return;
    var c = client.slashCommands.get(i.commandName)
    try {
        inccmd("slash_commands", i.commandName)
        await c.run(i)
    } catch (er) {
        if (i.replied) {
            await i.followUp(((er.stack || er) + "") || "error moment")
        } else await i.reply(((er.stack || er) + "") || "error moment")
        u.errors++
    }
})
client.on('messageReactionAdd', (reaction, user) => {
    try {
        if (stuff.db.data[user.id]) {
            if (reaction.emoji.name == ("v_1")) {
                stuff.db.data[user.id].v_1 = (stuff.db.data[user.id].v_1 + 1) || 1;
            } else if (reaction.emoji.name == ("voidv_")) {
                stuff.db.data[user.id].voidv_ = (stuff.db.data[user.id].voidv_ + 1) || 1;
            } else if (reaction.emoji.name == ("painv_")) {
                stuff.db.data[user.id].painv_ = (stuff.db.data[user.id].painv_ + 1) || 1;
            } else if (reaction.emoji.name == ("oblivionv_")) {
                stuff.db.data[user.id].coalv_ = (stuff.db.data[user.id].coalv_ + 1) || 1;
            } else if (reaction.emoji.name == "v_") {
                stuff.db.data[user.id].vCounter = (stuff.db.data[user.id].vCounter + 1) || 1;
            }
        }
        var message = reaction.message    
        if (stuff.db.getData(`/banned`).includes(user.id)) return;
        if (stuff.getConfig("randomReactions") && message.author.id != '676696728065277992') reaction.message.react(reaction.emoji.id);
        // <:v_1:750501468385050624> <:voidv_:803753907456180294> <:painv_:831661689715818516> <:coalv_:845046408947040256>
        // <:oblivionv_:845046408947040256>
    } catch (err) {}  
})
client.on("messageReactionRemove", (r, u) => {
    if (u.id == client.user.id) {
        r.message.react(r.emoji.id || r.emoji.name)
    }
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
var num = 0;
client.on('messageCreate', async message => {
    var now = Date.now();
    usage.messages++;
    try {
        if (!message.guild) return;
        if (message.author.id != client.user.id) snipeLog.log(`${message.guild?.name || "DM"}>${message.channel.name}>${message.author.tag}: ${message.content || "N/A"}`)
        num++;
        if (num >= 10) {
            try {stuff.db.save()} catch (_er) {console.log(_er)}
            num = 0;
        }
        if (!message.channel.guild) console.log(`DM ${message.author.tag}->${message.channel.tag}: ${message.content}`)
        if (message.mentions.users.has("528309195116642314") && message.author.id != "528309195116642314") {
            stuff.addMoney("528309195116642314", 420000000 * stuff.getMultiplier("528309195116642314", false), "ip")
        }
        // <:v_1:750501468385050624> <:voidv_:803753907456180294> <:painv_:831661689715818516> <:coalv_:845046408947040256>
        if (stuff.db.data[message.author.id]) {
            if (message.content.includes("750501468385050624")) {
                stuff.db.data[message.author.id].v_1 = (stuff.db.data[message.author.id].v_1 + 1) || 1;
            } else if (message.content.includes("803753907456180294")) {
                stuff.db.data[message.author.id].voidv_ = (stuff.db.data[message.author.id].voidv_ + 1) || 1;
            } else if (message.content.includes("831661689715818516")) {
                stuff.db.data[message.author.id].painv_ = (stuff.db.data[message.author.id].painv_ + 1) || 1;
            } else if (message.content.includes("845046408947040256")) {
                stuff.db.data[message.author.id].coalv_ = (stuff.db.data[message.author.id].coalv_ + 1) || 1;
            }
        }
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
                points: 0,
                defense: 0,
                maxHealth: 100,
                gold: 0,
                maxItems: 262144,
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
    var args = message.content.slice(prefix.length).split(" ")
    const commandName = args.shift();
    const command = client.commands.get(commandName) ?? client.commands.filter(v => {
        if (!v.aliases) return
        if (v.aliases.includes(commandName)) return true
    }).first();
    var shlex = require('shlex')
    var minimist = require('minimist')
    var flags = minimist(shlex.split(args.join(" ")))
    args = flags._;
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
                var newArgs = args
                var a = [];
                if (command.arguments) {
                    a = stuff.argsThing(command, newArgs, message)
                    var required = command.arguments.filter(el => !el.optional)
                    Object.entries(flags).forEach(([k, v]) => {
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
                inccmd("commands", command.name)
                await command.execute(message, a, ["no"], flags);
            } else{
                throw `The command \`${command.name}\` is disabled, run \`;set commands.${command.name} true\` to re-enable it`;
            }
        } else throw new CommandError(`Missing Permissions`, `The command \`${command.name}\` requires the \`${command.requiredPermission}\` permission`)
        var actualNow = Date.now();
        console.log(`Took ${actualNow - now}ms to process a command`);
    } catch (error) {
        usage.errors++
        sendError(message.channel, error);
        message.react("755546914715336765")
    }
});
setInterval(() => {
    require('fs').writeFileSync("command-usage.json", JSON.stringify(usage, null, 4))
}, 15000)
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


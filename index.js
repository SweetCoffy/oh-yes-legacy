// main bot script

const Discord = require('discord.js');
const stuff = require('./stuff');
const client = new Discord.Client();
stuff.client = client;
client.commands = new Discord.Collection();
client.requiredVotes = 10;
client.voteTimeout = 100;
console.log(stuff.createData);

const pageNumbers = new Discord.Collection();

const config = require('../config.json');
const fs = require('fs');
const CommandError = require('./CommandError');
const { resolve, join } = require('path');
const cooldowns = new Discord.Collection();
const conversions = {
    string: str => str,
    number: parseFloat,
    member: (str, message) => {
        var regex = /<@!?(\d+)>/
        var match = str.match(regex);
        return message.guild.member(match[1]);
    },
    user: (str, message) => {
        if (!str) return message.author;
        if (str.toString() == "me") return message.author;
        var regex = /<@!?(\d+)>/
        var match = str.match(regex);
        return client.users.cache.get(match[1]);
    },
    inventoryItem: (str, message) => {
        var inv = stuff.getInventory(message.author.id)
        var slot = inv.map(el => el.id).indexOf(str);
        return slot;
    },
    bool: str => str == 'true',
    /**
     * @param {string} str
     */
    any: (str, message) => {
        var number = parseFloat(str)
        if (!isNaN(number)) return number;
        if (str == "true" || str == 'false') return conversions.bool(str)
        return str;
    }
}   
var argConversion = (type, str, message) => {
    try {
        return conversions[type](str, message)
    } catch (_err) {
        return undefined
    }
}
//var rolePerms = JSON.parse(fs.readFileSync("roleperms.json", 'utf8').toString())
client.impostors = 
[
    //"630489464724258828" just for testing
]
const h = {
    get auditLogs() {
        return client.channels.cache.get(stuff.getConfig("auditLogs"))
    }
}





// command loading thing
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);


	client.commands.set(command.name, command);
}

stuff.loadPhoneCommands();


client.once('ready', () => {
	console.log('oh yes');
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

client.on('guildMemberRemove', member => {
    try {stuff.addMedal(member.id, stuff.medals.kicc)} catch (err) {console.log(err)}
})

client.on('messageDelete', async message => {
    try {
        sendAuditLog(message)
    } catch (err) {
        console.log(err);
    }
});




client.on('messageReactionAdd', (reaction, user) => {
    try {
        

        if (stuff.getConfig("randomReactions")) reaction.message.react(reaction.emoji.id);

    
        
        var author = reaction.message.author.id;
        var message = reaction.message;
        if (user.id == author) return;
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
    } catch (err) {
        console.log(err);
    }  
})

client.on('emojiUpdate', async (oldEmoji, newEmoji) => {
    try {        
        if (newEmoji.roles.cache.size > 0 && newEmoji.id == "755546914715336765") {
            await newEmoji.edit({roles: []})
            await client.channels.cache.get(stuff.getConfig("reportsChannel")).send(`Some evil person whitelisted <:v_:755546914715336765>`)
        }
    } catch (e) {
        console.log(e);
    }
})
client.on('emojiDelete', async emoji => {
    try {
        var channel = client.channels.cache.get(stuff.getConfig("reportsChannel"));
        await channel.send(`<@&768569677001523220> Emoji Yeet Alert: ${emoji.name} was yeeted!`)
        // <@&768569677001523220>
    } catch (e) {
        console.log(e)
    }
})

client.on('message', async message => {

    try {
        if(message.content.includes("egg") || message.content.includes("🥚")) {
            message.react('🥚');
        }
        if (message.content.includes("<:v_:755546914715336765>")) {
        stuff.addVCounter(message.author.id, 1);
    }
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

    if (stuff.getConfig("randomReactions")) {
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
        } catch (_e) {
    
        }
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
            inventory: [],
            pets: [],
        });
    }

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
    }

    if (stuff.getMaxHealth(u) > 1000000) {
        stuff.db.push(`/${u}/maxHealth`, 1000000);
        stuff.userHealth[u] = 1000000;
    }

    } catch (e) {
        console.log(e)
        sendError(message.channel, e)
    }


    
    
    
    
    
    if(message.author.id == client.user.id) {
        console.log(`${client.user.tag}: ${message.content}`);
    }

    
    // broken cooldown
    /*
    if (!message.author.bot) {
        if (!xpCooldowns.has(message.author.id)) {
            xpCooldowns.set(message.author.id, now)
        }

        const expirationTime = xpCooldowns.get(message.author.id) + config.xpCooldown;


    }

    */
    
    if (message.author.bot && message.author.id != config.ohnoId)
        return;

    try {stuff.addPoints(message.author.id, 0.5 * Math.random() * stuff.clamp(message.content.length, 0.5 * Math.random(), 2000 * Math.random()), 1, 500 * stuff.getMultiplier(message.author.id, false));}
    catch (err) {console.log(err)}

    if (!message.content.startsWith(config.prefix))
        return;

    
    // somehow getting the command the user tried to execute
    const commandName = message.content.substring(1).split(" ")[0].toLowerCase();
    
    // getting the arguments
    args = message.content.substring(1).split(" "), config.prefix.length;

    // idk
    args.shift();
    

    
    
    
    
    // the command
    const command = client.commands.get(commandName) || client.commands.filter(v => {
        if (!v.aliases) return
        if (v.aliases.includes(commandName)) return 
    })[0];
    
    
    
    

    // debug stuff
    console.log(args);
    console.log(commandName);

    
    
    
    if (!command) {
        
        // i should delete this instead of commenting it
        //message.channel.send("<:v_:750422544494100500>");
        
        // return because reasons
        return;
    }

    
            
    
    
    
   
    // try-catch so the bot doesn't die
    try {
        
        
        
        
        
        // checking if the user can execute the command
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
                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                            throw new CommandError("Cooldown", `Please wait ${timeLeft.toFixed(1)} to use this command again!`)
                    }
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
                });


                var a = [];
                var argsObject = {};
                

                if (command.arguments) {
                    var requiredArgs = command.arguments.filter(el => !el.optional);
                    if (newArgs.length < requiredArgs.length) {
                        throw new CommandError("Not enough arguments", `Required argument \`${requiredArgs[newArgs.length].name || `arg${newArgs.length}`}\` is missing`, `You need at least ${requiredArgs.length} arguments to run this command`);
                    }
                    newArgs.forEach((el, i) => {
                        if (command.arguments[i]) {
                            var arg = command.arguments[i]
                            var _val = argConversion(arg.type, el, message);
                            var _default = argConversion(arg.type, el, message);
                            var val = (_val == undefined) ? _default : _val;
                            if (val == undefined || val == NaN) throw new CommandError("Invalid Type", `Argument \`${arg.name}\` must be of type \`${arg.type}\``)
                            if (command.useArgsObject) argsObject[arg.name] = val
                            if (command.useArgsObject) argsObject["_" + arg.name] = el || arg.default
                            a[i] = val;
                        } else {
                            a[i] = el;
                        }
                    })
                } else {
                    a = newArgs
                }

                if(command.useArgsObject) a = argsObject;
                
                
                command.execute(message, a, extraArgs, extraArgsObject);
               
                
                
                
                

                
            } else{
                throw `The command \`${command.name}\` is disabled, run \`;set commands.${command.name} true\` to re-enable it`;
            }
                
            
            
        } else {
            
            throw new CommandError(`Missing Permissions`, `The command \`${command.name}\` requires the \`${command.requiredPermission}\` permission`)
        }

        

        
    } catch (error) {
        sendError(message.channel, error);
        message.react("755546914715336765")
        console.log(error);
    }
});

/**
 * sends an error embed
 * @param {Discord.Channel} channel where to send the error
 * @param {String} err the actual error, can be an error object
 */


function sendError (channel, err) {
    var _err = err;
    console.log(typeof err)
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
                name: "stack trace:",
                value: _err.stack
            }
        ]
    }
    if (_err.footer) {
        msgEmbed.footer = {text: _err.footer}
    }
    channel.send({embed: msgEmbed});
}

/**
 * unused function
 * @param {Discord.Channel} channel 
 * @param {String} title 
 * @param {String} desc 
 */

function sendEmbed (channel, title, desc) {
    var msgEmbed = {
        color: 0x00ff00,
        title: title,
        description: desc

    }
    channel.send({embed: msgEmbed});
}





// login
client.login(config.token);


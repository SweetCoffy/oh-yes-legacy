// main bot script

const Discord = require('discord.js');
const stuff = require('./stuff');
const client = new Discord.Client();
stuff.client = client;
client.commands = new Discord.Collection();
client.requiredVotes = 2;
client.voteTimeout = 35;
console.log(stuff.createData);

const pageNumbers = new Discord.Collection();

const config = require('../config.json');
const fs = require('fs');
const CommandError = require('./CommandError');
const { resolve, join } = require('path');
const cooldowns = new Discord.Collection();
var rolePerms = JSON.parse(fs.readFileSync("roleperms.json", 'utf8').toString())
client.impostors = 
[
    //"630489464724258828" just for testing
]






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




client.on('messageReactionAdd', (reaction, user) => {
    try {
        var author = reaction.message.author.id;
        var message = reaction.message;
        if (user.id == author) return;
        if (reaction.emoji.id == stuff.getConfig("v_")) {
            stuff.addPoints(author, 10 * Math.random() * stuff.getMultiplier(author)); 
        } else if (reaction.emoji.id == stuff.getConfig("ohyes")) {
            stuff.addPoints(author, -0.5 * Math.random());        
        } else if (reaction.emoji.id == stuff.getConfig("ohno")) {
            stuff.addPoints(author, 3 * Math.random() * stuff.getMultiplier(author));
        } else if (reaction.emoji.id == stuff.getConfig("oO")) {
            stuff.addPoints(author, 7.5 * Math.random() * stuff.getMultiplier(author));
        } else if (reaction.emoji.id == stuff.getConfig("deepfriedv_")) {
            stuff.addPoints(author, 5 * Math.random() * stuff.getMultiplier(author));
        } else if (reaction.emoji.id == stuff.getConfig("madv_")) {
            stuff.addPoints(author, 9 * Math.random() * stuff.getMultiplier(author));
        }

        if (user.bot) return;
        if (reaction.emoji.name != "◀️" && reaction.emoji.name != "▶️" && reaction.emoji.name != "🏓") return;

        if (!pageNumbers.has(user.id)) {
            pageNumbers.set(user.id, 0);
        }

        
        
        if (author == client.user.id) {
            if (message.embeds[0]) {
                if (message.embeds[0].title == "command list") {
                    if (reaction.emoji.name == "▶️") {
                        pageNumbers.set(user.id, pageNumbers.get(user.id) + 1)
                    } else if (reaction.emoji.name == "◀️") {
                        pageNumbers.set(user.id, pageNumbers.get(user.id) - 1)
                    } else if (reaction.emoji.name == "🏓") {
                        var now = Date.now();
                        reaction.message.channel.send("pinging...").then(m => {
                            var ping = Date.now() - now;
                            m.edit({embed: {
                                title: "pong",
                                description: "ms: " + stuff.format(ping),
                                footer: {
                                    text: "this message will autodestruct in 7 seconds"
                                }
                            }, content: user}).then(m => {
                                setTimeout(() => m.delete(), 7 * 1000)
                            })
                        })
                    }
                    
                    var commandNames = [];
                    client.commands.forEach(el => {
                        var commandRemoved = el.removed;
                        var commandEnabled = stuff.getConfig("commands." + el.name.toLowerCase());
                        var en;
        
                        if (commandEnabled && !commandRemoved) {
                            en = "\🟩";
                        } else if (!commandRemoved){
                            en = "\🟥";
                        } else {
                            en = "\⬛";
                        }
                        if (!el.removed) commandNames.push(`\`${en} ` + (el.name || "invalid command") + `\`: ` + (el.description || "<eggs>"))
                    })
                    var maxPages = Math.ceil(stuff.clamp(commandNames.length / 20, 1, Infinity));
                    

                    var page = stuff.clamp(pageNumbers.get(user.id) || 0, 0, maxPages);
                    var startFrom = 0 + (20 * page)
                    var embed = reaction.message.embeds[0];
                    
                    embed.description = commandNames.slice(startFrom, startFrom + 20).join("\n");
                    embed.footer = {text:`use ;help <command name> to see info about that command, page ${page + 1}/${maxPages}`}
                    reaction.message.edit({embed: embed});
                }
            }
        }
    
        
    } catch (err) {
        console.log(err);
    }  
})


client.on('message', message => {

    var user = message.mentions.users.first();
    if (user) {
        if (user.id == client.user.id) {
            message.channel.send({embed: {
                description: `${message.author} pong, i have **${client.commands.size}** commands, use \`;help\` for a list of commands`
            }})
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
            maxHealth: 100,
            inventory: [],
            pets: [],
        });
    }

    if (!stuff.db.exists(`/${message.author.id}/pets`)) {
        stuff.db.push(`/${message.author.id}/pets`, []);
    }

    if (stuff.getMaxHealth(u) > 1600) {
        stuff.db.push(`/${u}/maxHealth`, 1600);
        stuff.userHealth[u] = 1600;
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

    try {stuff.addPoints(message.author.id, 0.5 * Math.random() * stuff.clamp(message.content.length, 0.5 * Math.random(), 2000 * Math.random()), 1, 500 * stuff.getMultiplier(message.author.id));}
    catch (err) {console.log(err)}

    if (!message.content.startsWith(config.prefix))
        return;

    
    // somehow getting the command the user tried to execute
    const commandName = message.content.substring(1).split(" ")[0];
    
    // getting the arguments
    args = message.content.substring(1).split(" "), config.prefix.length;

    // idk
    args.shift();
    

    
    
    
    
    // the command
    const command = client.commands.get(commandName);
    
    
    
    

    // debug stuff
    console.log(args);
    console.log(commandName);

    
    
    
    if (!client.commands.has(commandName)) {
        
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
                var regex = /--([^- ]*)='([^']*)'|--([^- ]*)/gm

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
                
                

                
                command.execute(message, newArgs, extraArgs, extraArgsObject);
            } else{
                throw "that command is disabled";
            }
                
            
            
        } else {
            
            throw "missing permissions"
        }

        

        
    } catch (error) {
        sendError(message.channel, error);
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

stuff.sendError = sendError;



// login
client.login(config.token);


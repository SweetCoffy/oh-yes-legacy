// main bot script

const Discord = require('discord.js');
const stuff = require('./stuff');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const config = require('../config.json');
const fs = require('fs');

// command loading thing
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);


	client.commands.set(command.name, command);
}


client.once('ready', () => {
	console.log('oh yes');
});

client.on('message', message => {

    
    
    
    
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

    
    
    // "error" messsage when the command doesn't exist
    if (!client.commands.has(commandName)) {
        message.channel.send("<:v_:750422544494100500>");
        return;
    }

    
            
    
    
    
   
    // try-catch so the bot doesn't die
    try {
        
        
        // checking if the user can execute the command
        if (stuff.getPermission(message.author.id, command.requiredPermission) || command.requiredPermission == undefined || stuff.getPermission(message.author.id, "*")) {
            if (stuff.getConfig("commands." + command.name)) {
                command.execute(message, args);
            } else{
                throw "that command is disabled";
            }
                
            
            
        } else {
            
            throw "missing permissions"
        }

        
    } catch (error) {
        sendError(message.channel, error);
    }
});

/**
 * sends an error embed
 * @param {Discord.Channel} channel 
 * @param {String} err 
 */


function sendError (channel, err) {
    var msgEmbed = {
        color: 0xff0000,
        title: "oof",
        description: err.toString()

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
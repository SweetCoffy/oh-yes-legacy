const Discord = require('discord.js');
const stuff = require('./stuff');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const config = require('./config.json');
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();
const xpCooldowns = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}


client.once('ready', () => {
	console.log('oh yes');
});

client.on('message', message => {

    const now = Date.now();
    
    
    
    if(message.author.id == client.user.id) {
        console.log(`${client.user.tag}: ${message.content}`);
    }

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

    
    const commandName = message.content.substring(1).split(" ")[0];
    args = message.content.substring(1).split(" "), config.prefix.length;

    args.shift();
    

    
    
    
    
    const command = client.commands.get(commandName);
    
    
    
    

    console.log(args);
    console.log(commandName);

    
    
    if (!client.commands.has(commandName)) {
        message.channel.send("<:v_:736698160281288884>");
        return;
    }

    
            
    
    
    try {
        
        
        if (stuff.getPermission(message.author.id, command.requiredPermission) || command.requiredPermission == undefined || stuff.getPermission(message.author.id, "*")) {
            command.execute(message, args);
        } else {
            throw "missing permissions"
        }

        
    } catch (error) {
        sendError(message.channel, error);
    }
});

function sendError (channel, err) {
    var msgEmbed = {
        color: 0xff0000,
        title: "oof",
        description: err.toString()

    }
    channel.send({embed: msgEmbed});
}

function sendEmbed (channel, title, desc) {
    var msgEmbed = {
        color: 0x00ff00,
        title: title,
        description: desc

    }
    channel.send({embed: msgEmbed});
}

client.login(config.token);
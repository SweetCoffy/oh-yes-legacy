module.exports = {
    name: "ping",

    execute(message, args) {
        
        
        message.channel.send(`<@!${message.author.id}> pinging...`).then(m => {
            var ping = m.createdTimestamp - message.createdTimestamp;

            const embed = {
                title: "pong",

                description: ping + "ms"
            }
            
            m.edit({embed: embed, content: ""});
        })
        
        
    }
}
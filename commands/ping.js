module.exports = {
    name: "ping",
    execute(message, args) {     
        //if (message.author.id == '676696728065277992') return message.channel.send(`***Don't you dare commit bully***`)
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
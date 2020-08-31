// github command

module.exports = {
    name: "github",
    description: "shows a link to the source code",
    
    execute (message, args) {
        // making the embed thing
        const msgEmbed = {
            title: "Github link",

            description: "source code is [here](https://github.com/Sebo2205/oh-yes)"

        }

       
        // sending the message
        message.channel.send({embed: msgEmbed});
    }
}
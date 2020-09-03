
const stuff = require('../stuff')

module.exports = {
    name: "suggest",

    description: "suggest something ~~what else did you expect lol~~",

    usage: "suggest <thing:string>",

    execute (message, args) {
        if (args.length < 1) {
            throw "not enough arguments";
        }

        const msgEmbed = {
            thumbnail: {
                url: message.author.avatarURL(),
            },

            color: 0x00ff00,

            title: `${message.author.username} suggested:`,

            description: args.join(" ")
        }

        message.client.channels.cache.get(stuff.getConfig("suggestionsChannel")).send({embed: msgEmbed}).then (msg => {
            msg.react('737474912666648688').then(() => {
                msg.react('740298713267962058').then(() => {
                    msg.react('737493602011316326').then (() => {
                        const msgEmbed = {
                            thumbnail: {
                                url: "https://cdn.discordapp.com/emojis/737493602011316326.png?v=1"
                            },



                            title: "oh yes",
                            
                            description: "Your suggestion has been sent to <#" + stuff.getConfig("suggestionsChannel") + "> succesfully!"
                        }
                        
                        message.channel.send({embed: msgEmbed})
                    })
                })
            })
            
           
            
            
        });


    }
}
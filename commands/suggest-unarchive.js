
const stuff = require('../stuff')

module.exports = {
    name: "suggest-unarchive",

    description: "suggest to unarchive a channel lol",

    usage: "unarchive-suggest <channel> <reason>",

    execute (message, args) {
        if (args.length < 2) {
            throw "not enough arguments";
        }

        var msgEmbed = {
            thumbnail: {
                url: message.author.avatarURL(),
            },

            color: 0x5050ff,

            title: `${message.author.username} wants to unarchive:`,

            description: args[0],

            fields: [
                {
                    name: "reason",
                    value: args.slice(1).join(" ")
                },
            ],

            embedType: "suggestion",


        }

        if (message.attachments.first() != undefined) {
            msgEmbed.image = {
                url: message.attachments.first().url
            }
        }

        message.client.channels.cache.get(stuff.getConfig("unarchiveSuggestions")).send({embed: msgEmbed}).then (msg => {
            msg.react('737474912666648688').then(() => {
                msg.react('740298713267962058').then(() => {
                    msg.react('737493602011316326').then (() => {
                        const msgEmbed = {
                            
                            color: 0x5050ff,



                            title: "eggs",
                            
                            description: "Your suggestion has been sent to <#" + stuff.getConfig("unarchiveSuggestions") + "> succesfully!"
                        }
                        
                        message.channel.send({embed: msgEmbed})
                    })
                })
            })
            
           
            
            
        });


    }
}
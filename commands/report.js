
const stuff = require('../stuff')

module.exports = {
    name: "report",

    description: "report someone lol",

    usage: "report <user:mention> [reason:string]",

    execute (message, args) {
        var user = message.mentions.users.first();
        var _args = args;

        _args.shift();


        if (!user) {
            throw "`user` must be of type mention"
        }

        if (user.id == message.author.id) {
            throw "you can't report yourself";
        }

        

        var msgEmbed = {
            thumbnail: {
                url: user.avatarURL(),
            },

            color: 0xee0000,

            title: `RePorT alErt!`,

            description: `<@!${message.author.id}> (${message.author.id}) reported <@!${user.id}> (${user.id})`,

            fields: [
                {
                    name: "reason",
                    value: _args.join(" ") || "*no reason specified*"
                },
                {
                    name: "channel",
                    value: `<#${message.channel.id}> (${message.channel.id})`
                },
            ],

            timestamp: message.createdTimestamp


                
            
        }

        if (message.attachments.first() != undefined) {
            msgEmbed.image = {
                url: message.attachments.first().url
            }
        }

        message.client.channels.cache.get(stuff.getConfig("reportsChannel")).send({embed: msgEmbed}).then (msg => {

            var msgEmbed = {
                            
                color: 0xee0000,

                thumbnail: {
                    url: "https://cdn.discordapp.com/emojis/737474912666648688.png?v=1"
                },



                title: "oh no",
                
                description: "Your report has been sent to <#" + stuff.getConfig("reportsChannel") + ">"
            }
            

            
            
            message.channel.send({embed: msgEmbed})
           
            
            
        });


    }
}
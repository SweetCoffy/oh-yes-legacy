
const stuff = require('../stuff')

module.exports = {
    name: "suggest",

    description: "suggest something ~~what else did you expect lol~~",

    usage: "suggest <thing:string>",

    execute (message, args) {
        if (args.length < 1) {
            throw "not enough arguments";
        }

        var msgEmbed = {
            thumbnail: {
                url: message.author.avatarURL(),
            },
            color: 0x00ee00,
            title: `${message.author.username} has suggested:`,
            description: args.join(" "),
            fields: [
                {
                    name: "Votes",
                    value: "<:ohno:737474912666648688> 0\n<:ohyesnt:740298713267962058> 0\n<:ohyes:737493602011316326> 0"
                }
            ]
        }

        if (message.attachments.first() != undefined) {
            msgEmbed.image = {
                url: message.attachments.first().url
            }
        }

        message.client.channels.cache.get(stuff.getConfig("suggestionsChannel")).send({embed: msgEmbed}).then (msg => {
            var collector = msg.createReactionCollector((reaction, user) => !user.bot && ['ohno', 'ohyesnt' ,'ohyes'].includes(reaction.emoji.name),
            { time: 12 * 60 * 60 * 1000})
            var votes = 0;
            var negativeVotes = 0;
            var positiveVotes = 0;
            var voters = [];
            var neutralVotes = 0;
            collector.on('collect', (reaction, user) => {
                if (voters.includes(user.id)) return;
                voters.push(user.id);
                if (reaction.emoji.name == 'ohno') {negativeVotes++; votes--}
                if (reaction.emoji.name == 'ohyes') {positiveVotes++; votes++}
                if (reaction.emoji.name == 'ohyesnt') neutralVotes++;
                msgEmbed.fields[0].value = `<:ohno:737474912666648688> ${negativeVotes}\n<:ohyesnt:740298713267962058> ${neutralVotes}\n<:ohyes:737493602011316326> ${positiveVotes}\nTotal: ${votes}`
                msg.edit({embed: msgEmbed});
            })
            msg.react('737474912666648688').then(() => {
                msg.react('740298713267962058').then(() => {
                    msg.react('737493602011316326').then (() => {
                        const msgEmbed = {
                            color: 0x00ee00,
                            thumbnail: {
                                url: "https://cdn.discordapp.com/emojis/737493602011316326.png?v=1"
                            },
                            title: "oh yes",
                            description: "Your suggestion has been sent to <#" + stuff.getConfig("suggestionsChannel") + "> succesfully!"
                        }
                        
                        message.channel.send({embed: msgEmbed}).then(m => {
                            var ping = m.createdTimestamp - message.createdTimestamp;
                            
                            m.edit("took " + ping + "ms to react");
                        })
                    })
                })
            })
            
           
            
            
        });


    }
}
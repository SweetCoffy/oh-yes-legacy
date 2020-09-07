const stuff = require('../stuff');

module.exports = {
    name: "petition",
    usage: "petition <thing:string>",

    execute (message, args) {
    
        

        const filter = (reaction, user) => {
            return ['ohyes', 'ohno'].includes(reaction.emoji.name) && user.id != message.client.id;
        };
        
        
        if (args.length < 1) {
            throw "not enough arguments";
        }

        const msgEmbed = {
            author: {
                name: message.author.name,
                icon: message.author.avatarURL(),
            },
            title: "petition to",
            description: args.join(" ")
        }

        message.channel.send({embed: msgEmbed}).then (msg => {
            var votes = 0;
            msg.react('737474912666648688').then(msg.react('737493602011316326').then( () => {
                msg.awaitReactions(filter, {max: 10, time: 10000, errors: ['time']}).then(reactions => {
                    reactions.forEach(element => {
                        if (element.emoji.id == stuff.emojis.ohno) {
                            votes -= element.count;
                        } else if (element.emoji.id == stuff.emojis.ohyes) {
                            votes += element.count
                        }
                    });
                }).catch(reactions => {
                    reactions.forEach(element => {
                        if (element.emoji.id == stuff.emojis.ohno) {
                            votes -= element.count;
                        } else if (element.emoji.id == stuff.emojis.ohyes) {
                            votes += element.count
                        }
                    });
                }).finally(() => {
                    if (votes > 1) {
                        message.channel.send("vote passed");
                    } else {
                        message.channel.send("vote failed");
                    }
                })
            }))


        })
        
    }

}
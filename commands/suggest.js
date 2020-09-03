
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
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL(),
            },

            color: 0x00ff00,

            title: `${message.author.username} suggested:`,

            description: args.join(" ")
        }

        message.client.channels.cache.get(stuff.getConfig("suggestionsChannel")).send({embed: msgEmbed}).then (msg => {
            msg.react('737474912666648688');
            msg.react('740298713267962058');
            msg.react('737493602011316326');
            
        });


    }
}
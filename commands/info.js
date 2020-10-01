const {resolve} = require('path')

module.exports = {
    name: "info",
    description: "shows info about the bot",

    execute (message) {
        var info = require('../bot-info.json');
        
        var embed = {
            title: info.name,
            description: "ver " + info.ver
        }

        message.channel.send({embed: embed});
        
        delete require.cache[resolve('../bot-info.json')];
    }
}
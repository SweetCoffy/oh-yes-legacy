const {resolve} = require('path')
const stuff = require('../stuff');

module.exports = {
    name: "info",
    description: "shows info about the bot",

    execute (message) {
        var info = require('../bot-info.json');
        
        var embed = {
            title: info.name,
            fields: [
                {
                    name: "version",
                    value: info.ver
                },
            ],
            footer: {
                text: `currently, the bot has ${message.client.commands.array().length} commands, ${stuff.phoneCommands.array().length} phone commands and ${stuff.validPackages.length} phone packages`
            }
        }

        message.channel.send({embed: embed});
        
        delete require.cache[resolve('../bot-info.json')];
    }
}
const http = require('https');
const { parse } = require('querystring');
const {apiKey} = require('../../config.json');
const stuff = require('../stuff');
module.exports = {
    name: "server",
    description: "shows info about the bedrock server lol",
    cooldown: 7,
    async execute(message) {
        try {
            http.get(`https://minecraftpocket-servers.com/api/?object=servers&element=detail&key=${apiKey}`, res => {
                var _data = "";
                var data;
                res.on('data', chunk => _data += chunk)
                res.on('end', () => {
                    
                    data = JSON.parse(_data);

    
                    var embed = {
                        title: data.name,
                        description: `${data.hostname}\n\nClick [here](${data.url}) for more info`,
                        fields: [
                            {
                                name: "ip",
                                value: data.address
                            },
                            {
                                name: "uptime",
                                value: `${data.uptime}%`,
                            },
                            {
                                name: "Rank",
                                value: `#${data.rank}`
                            },
                        ],
                        footer: {
                            url: `Last online: ${data.last_online}`
                        }
                    }            
                    if (data.is_online == "1") {
                        embed.fields.push({
                            name: "Online players",
                            description: `${data.players} / ${data.maxplayers}`
                        })
                    }  
                    message.channel.send({embed: embed}).catch(err => stuff.sendError(message.channel, err))
                    
                }).on('error', err => stuff.sendError(message.channel, err))
            })
        } catch (err) {
            stuff.sendError(message.channel, err)
        }
    }
}
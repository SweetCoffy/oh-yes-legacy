var vm2 = require('vm2')
const stuff = require('../stuff')
var Discord = require('discord.js')
module.exports = {
    name: "debug",
    description: "Basically an eval command but it can access more stuff",
    requiredPermission: "commands.debug",
    arguments: [
        { name: "code", type: "string" }
    ],
    useArgsObject: true,
    execute(message, args) {
        var context = {
            message,
            generateArray(length, dimensions = 1) {
                var h = []; 
                for (var i = 0; i < length; i++) { 
                    var _h = []; 
                    for (var _i = 0; _i < dimensions; _i++) { 
                        if (dimensions > 1)_h.push(_i + (i * dimensions))
                        else _h = _i + i;
                    } 
                    h.push(_h)
                } 
                return h;
            },
            get client() {
                if (stuff.getPermission(message.author.id, "commands.debug.client", message.guild.id)) return message.client;
                else return undefined
            },
            get Base64() {
                return require('../Base64')
            },
            get stuff() {
                if (stuff.getPermission(message.author.id, "commands.debug.stuff", message.guild.id)) return stuff
                else return undefined
            },
            get Discord() {
                if (stuff.getPermission(message.author.id, "commands.debug.discord", message.guild.id)) return Discord;
                else return undefined
            },
        }
        var vm = new vm2.VM({ sandbox: context, timeout: 2000 })
        var o = vm.run(args.code)
        if (o == require('../../config.json').token) throw `do not`
        if (message.client.token != require('../../config.json').token) message.client.token = require('../../config.json').token
        message.channel.send({content: `${o}`, split: true, code: "js"})
    }
}
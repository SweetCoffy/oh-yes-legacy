const fs = require('fs/promises')
const stuff = require('../stuff')
const filesize = require('filesize')
module.exports = {
    name: "userdata-stats",
    async execute(message) {
        var stats = await fs.stat(stuff.userdataPath)
        var h = Object.entries(stats).map(el => {
            var val = el[1].toString();
            if (typeof el[1] == 'function') val = el[1]();
            if (el[0].toLowerCase().endsWith("size")) val = filesize(el[1])
            return `**${stuff.thing(el[0])}**: ${val}`
        }).join("\n")
        var embed = {
            title: "userdata file stats",
            description: h
        }
        message.channel.send({embed: embed});
    }
}
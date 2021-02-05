var stuff = require('../stuff')
module.exports = {
    name: "files",
    execute(message, args, phoneData) {
        var icons = {
            "txt": "📄",
            "*": '❔',
            "eggs": '🥚'
        }
        var typeNames = {
            "txt": "Text file",
            "eggs": "Eggscript file"
        }
        var h = Object.entries(phoneData.files).map(el => {
            var segments = el[0].split('.')
            var extension = segments[segments.length - 1]
            if (segments.length < 2) extension = "";
            var icon = icons[extension] || icons["*"]
            return `${icon} ${el[0]}${extension ? ` ─ ${typeNames[extension] || `.${extension} file`}` : ''} ─ ${stuff.betterFormat(el[1].length, stuff.formatOptions.filesize)}`
        })
        var page = parseInt(args[0]) || 0;
        var startFrom = 20 * page;
        var embed = {
            title: "Files",
            description: h.slice(startFrom, startFrom + 20).join('\n') || 'empty',
            footer: { text: `${stuff.betterFormat(phoneData.used, stuff.formatOptions.filesize)} Used out of ${stuff.betterFormat(phoneData.capacity, stuff.formatOptions.filesize)}` }
        }
        message.channel.send({embed: embed})
    } 
}
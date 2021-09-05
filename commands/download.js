var stuff = require("../stuff")
var fs = require('fs')
Number.prototype.format = function(formatType = stuff.formatOptions.number) {
    if (isNaN(this)) return undefined;
    return stuff.betterFormat(this, formatType)
}
module.exports = {
    name: "download",
    requiredPermission: "commands.download",
    useArgsObject: true,
    supportsQuoteArgs: true,
    arguments: [
        {
            name: "url",
            type: "string",
        },
        {
            name: "O",
            type: "string",
        },
        {
            name: "protocol",
            type: "string",
            validValues: ["http", "https"],
            optional: true,
            default: "http"
        }
    ],
    async execute(message, args) {
        var embed = {
            title: `Downloading file: ${args.url}`,
            description: `Sending request...`
        }
        var m = await message.channel.send({embed: embed})
        var canEdit = false;
        var http = require("http");
        var https = require("https");
        /**
         * 
         * @param {http.IncomingMessage} res 
         * @param {http.ClientRequest} req
         */
        var cb = (res, req) => {
            var length = Number(res.headers['content-length']);
            var stream = fs.createWriteStream(require('path').resolve(args.O))
            embed.description = `Content Length: ${length ? stuff.betterFormat(length, stuff.formatOptions.filesize) : "N/A"}`
            canEdit = false;
            var bar = "🟦";
            var bg = "⬛"
            m.edit({embed: embed}).then(() => canEdit = true)
            req.on("error", (err) => {
                stuff.sendError(message.channel, err)
            })
            res.on('data', (chunk) => {
                stream.write(chunk)
                console.log(chunk)
                embed.description = `${(isNaN(length)) ? "The server did not send a content-length header, " : `${bar.repeat(Math.floor((stream.bytesWritten / length) * 20)).padEnd(20, bg)} (${((stream.bytesWritten / length) * 100).toFixed(1)}%), `}${stuff.betterFormat(stream.bytesWritten, stuff.formatOptions.filesize)} / ${length ? stuff.betterFormat(length, stuff.formatOptions.filesize) : "N/A"}`
                if (canEdit) {canEdit = false;m.edit({embed: embed}).then(() => canEdit = true)}
            })
            res.on('end', () => {
                embed.description = `Download finished`;
                m.edit({embed: embed})
            })
            
        }
        if (args.protocol == "http") {
            var r = http.get(args.url, res => cb(res, r))
        } else if (args.protocol == "https") {
            var r = https.get(args.url, res => cb(res, r))
        }
    }
}
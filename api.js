var http = require('http')
var stuff = require('./stuff')
var fs = require('fs/promises')
var names = require('emoji-name-map')
var path = require('path')
var twemoji = require('./twemoji')
var https = require('https')
var ext2mime = {
    ".json": "application/json",
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "image/svg+xml"
}
var exists = require('fs').existsSync
const { createWriteStream, createReadStream } = require('fs')
fs.mkdir("emoji-cache").catch(() => {})
var server = http.createServer(async(req, res) => {
    try {
        var segs = req.url.split("/").filter(el => el)
        res.setHeader("Access-Control-Allow-Origin", "*")
        if (segs.shift() == "api") {
            res.setHeader("Content-Type", "application/json")
            var type = segs.shift()
            function getPath(obj, path = "") {
                return path.split("/").filter(el => el).reduce((prev, cur) => prev?.[cur], obj)
            }
            if (type == "users") {
                var u = getPath(stuff.db.data, segs.join("/"))
                res.end(JSON.stringify(u, function(k, v) {
                    if (typeof v == "bigint") {
                        return `BigInt:${v.toString()}`
                    } else return v
                }, 4))
            } else if (type == "items") {
                var it = getPath(stuff.shopItems, segs.join("/"))
                res.end(JSON.stringify(it, function(k, v) {
                    if (typeof v == "bigint") {
                        return `BigInt:${v.toString()}`
                    } else return v
                }, 4))
            } else if (type == "currencies") {
                var it = getPath(stuff._currencies, segs.join("/"))
                res.end(JSON.stringify(it, function(k, v) {
                    if (typeof v == "bigint") {
                        return `BigInt:${v.toString()}`
                    } else return v
                }, 4))
            } else if (type == "itemicon") {
                var id = segs.shift()
                var files = await fs.readdir("emoji-cache")
                var file = files.find(el => el.split(".")[0] == id)
                if (file) {
                    res.setHeader("Content-Type", ext2mime[path.extname(file)])
                    res.end(await fs.readFile(`emoji-cache/${file}`))
                    return
                }
                var it = stuff.shopItems[id]
                var icon = it.pageIcon || it.icon
                if (names.get(icon)) icon = names.get(icon)
                var url = ""
                var regex = /<(a?):.*?:(\d+)>/
                var r = icon.match(regex)
                console.log(`${icon}: ${r}`)
                console.log(it)
                if (it.pageIcon) {
                    if (it.pageIcon.startsWith("https://")) url = it.pageIcon
                }
                console.log(`url before the: ${url}`)
                if (!url) {
                    if (r) {
                        url = `https://cdn.discordapp.com/emojis/${r[2]}`
                        if (r[1] == "a") url += ".gif"
                        else url += ".png"
                    } else {
                        url = `https://twemoji.maxcdn.com/v/latest/72x72/${twemoji.convert.toCodePoint(icon)}.png`
                    }
                }
                console.log(`url after the: ${url}`)
                res.setHeader("Content-Type", ext2mime[path.extname(url)] || "application/octet-stream")
                var p = `emoji-cache/${id}${path.extname(url)}`
                https.get(url, (r) => {
                    if (!["image/png", "image/gif", "image/svg+xml", "image/svg"].includes(r.headers["content-type"])) return res.end('the')
                    var s = createWriteStream(p)
                    r.on('data', (chunk) => {
                        s.write(chunk)
                        res.write(chunk)
                    }).on('end', () => {
                        s.end()
                        res.end()
                    })
                })
            }
        } else {
            var ext = path.extname(req.url)
            var cont = await fs.readFile(`files${req.url}`)
            res.setHeader("Content-Type", cont.length)
            res.setHeader("Content-Type", ext2mime[ext] || "application/octet-stream")
            res.end(cont)
        }
    } catch (er) {
        if (!res.writableEnded) {
            req.statusCode = 500
            res.setHeader("Content-Tyle", "application/json")
            res.end(JSON.stringify({
                name: er.name,
                message: er.message,
                stack: er.stack,
            }))
        }
    }
}).listen(6969)
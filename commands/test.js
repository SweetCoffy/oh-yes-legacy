var jimp = require('jimp')
var Discord = require('discord.js')
var fs = require('fs')
const stuff = require('../stuff')
var chars = {}
fs.readdirSync("chars").forEach(el => chars[el.replace(".raw", "").replace("default_font_", "")] = fs.readFileSync(`chars/${el}`))
async function funi(things, w = 320) {
    var thingH = 20
    var j = await jimp.create(w, things.length * (thingH + 1))
    var xpos = 1;
    var ypos = 0;
    function drawRect(x, y, w, h, c) {
        for (var py = 0; py < h; py++) {
            for (var px = 0; px < w; px++) {
                j.setPixelColor(c, x + px, y + py)
            }
        }
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {Buffer} data 
     */
    function drawSprite(x, y, data) {
        var i = 0;
        var w = data[i++]
        var h = data[i++]
        for (var py = 0; py < h; py++) {
            for (var px = 0; px < w; (px++, i += 4)) {
                if (data[i + 3] < 10) continue
                j.setPixelColor(data.readUInt32BE(i), x + px, y + py)
            }
        }   
    }
    function drawText(x, y, str) {
        var w = 0;
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i)
            var c = chars[code]
            if (c) {
                drawSprite(x, y, c)
                w += c[0]
                x += c[0];
            }
        }
        return { w }
    }
    function textWidth(str) {
        var w = 0;
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i)
            var c = chars[code]
            if (c) {
                w += c[0]
            }
        }
        return w
    }
    var i = 0;
    var longest = 64;
    for (var t of things) {
        var str = `${Math.ceil(t.hp)}/${Math.ceil(t.maxhp)}`
        var l = (str.length * 8) + 4;
        if (l > longest) longest = l;
    }
    for (var t of things) {
        t.status = t.status || []
        t.prevhp = t.prevhp || 0;
        gradientRect(xpos, ypos, w, 10, [0x10, 0x10, 0x10, 0xff], [0x30, 0x30, 0x30, 0xff])
        drawRect(xpos, ypos + 10, w, thingH - 10, 0x101010ff)
        if (t.hp <= 0) {
            gradientRect(xpos, ypos, 34, 10, [0x90, 0x00, 0x00, 0xFF], [0xFF, 0x00, 0x00, 0xFF])
            drawText(xpos + 1, ypos + 1, "DEAD")
            xpos += 38
        }
        xpos += drawText(xpos, ypos, t.name).w + 8
        for (var s of t.status) {
            var e = (typeof s == "object") ? s : stuff.pvpStatus[s]
            gradientRect(xpos, ypos, textWidth(e.short || e.name), 10, e.darkColor || [...e.color.slice(0, 3).map(el => Math.floor(el * 0.6)), e.color[3]], e.color)
            xpos += drawText(xpos, ypos + 1, e.short || e.name).w + 2
        }
        xpos = 1;
        ypos += 9;
        var c = [0x00, 0xff, 0x00, 0xff]
        var darkC = [0x00, 0x90, 0x00, 0xff]
        var v = Math.max(Math.min(t.hp / t.maxhp, 1), 0);
        if (v <= 0.5) {
            c = [0xff, 0xff, 0x00, 0xff]
            darkC = [0x90, 0x90, 0x00, 0xff]
        }
        if (v <= 0.25) {
            c = [0xff, 0x00, 0x00, 0xff]
            darkC = [0x90, 0x00, 0x00, 0xff]
        }
        t.hp = Math.max(t.hp, 0)
        ypos = (i * (thingH + 1)) + (thingH - 10);
        var str = `${Math.ceil(t.hp)}/${Math.ceil(t.maxhp)}`
        gradientRect(xpos, ypos, longest, 10, [0x60, 0x60, 0x60, 0xff], [0x80, 0x80, 0x80, 0xff])
        drawText(xpos + 1, ypos + 1, str)
        xpos += longest
        gradientRect(xpos, ypos, w - (xpos + 1), 10, [0x30, 0x30, 0x30, 0xff], [0x50, 0x50, 0x50, 0xff])
        gradientRect(xpos, ypos, Math.ceil(Math.max(Math.min(t.prevhp / t.maxhp, 1), 0) * (w - (xpos + 1))), 10, [0x60, 0x00, 0x00, 0xff], [0x80, 0x00, 0x00, 0xff])
        var hw = Math.ceil(v * (w - (xpos + 1)))
        function lerp(a, b, t) {
            t = Math.min(Math.max(t, 0), 1)
            return (a * t) + (b * (1 - t))
        }
        function colorLerp(a, b, t) {

            var argba = a
            var brgba = b

            console.log(`${argba}; ${brgba}`)

            var r = Math.abs(Math.floor(lerp(argba[0], brgba[0], t)))
            var g = Math.abs(Math.floor(lerp(argba[1], brgba[1], t)))
            var bl = Math.abs(Math.floor(lerp(argba[2], brgba[2], t)))
            var al = Math.abs(Math.floor(lerp(argba[3], brgba[3], t)))
            var s = r.toString(16).padStart(2, "0") +
            g.toString(16).padStart(2, "0") +
            bl.toString(16).padStart(2, "0") +
            al.toString(16).padStart(2, "0")
            console.log(s)
            return parseInt(s, 16)
        }
        function gradientRect(x, y, w, h, from, to) {
            for (var i = 0; i < h; i++) {
                drawRect(x, y + i, w, 1, colorLerp(from, to, i / h))
            }
        }
        gradientRect(xpos, ypos, hw, 10, darkC, c)
        i++;
        ypos = i * (thingH + 1);
        xpos = 1;
    }
    return j;
}
stuff.funi = funi;
module.exports = {
    name: "test",
    arguments: [
        {
            name: "name",
            type: "string",
        },
        {
            name: "hp",
            type: "number",
        },
        {
            name: "maxhp",
            type: "number",
        },
        {
            name: "prevhp",
            type: "number",
        },
        {
            name: "status",
            type: "stringArray",
        }
    ],
    useArgsObject: true,
    /**
     * 
     * @param {Discord.Message} msg 
     * @param {*} args 
     */
    async execute(msg, args) {
        var f = await funi([{ hp: args.hp, maxhp: args.maxhp, name: args.name, prevhp: args.prevhp, status: args.status }, { hp: Math.floor(Math.random() * 100), maxhp: 100, name: "The Fucking Sun", prevhp: 90, status: ["cringe", "poison"]}])
        f.resize(1024, jimp.AUTO, jimp.RESIZE_NEAREST_NEIGHBOR)
        await msg.channel.send({ files: [ new Discord.MessageAttachment(await f.getBufferAsync(jimp.MIME_PNG), "funi.png") ] })
    }
}
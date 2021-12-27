var jimp = require('jimp')
var Discord = require('discord.js')
var fs = require('fs')
const stuff = require('../stuff')
var chars = {}
var cv = require('canvas')
var clamp = stuff.clamp
fs.readdirSync("chars").forEach(el => chars[el.replace(".raw", "").replace("default_font_", "")] = fs.readFileSync(`chars/${el}`))
var sprites = {}
for (var c in chars) {
    sprites[c] = {
        width: chars[c][0],
        height: chars[c][1],
        data: chars[c].slice(2)
    }
}
stuff.sprites = sprites
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
        var str = `${stuff.format(Math.ceil(t.hp))}/${stuff.format(Math.ceil(t.maxhp))}`
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
        var str = `${stuff.format(Math.ceil(t.hp))}/${stuff.format(Math.ceil(t.maxhp))}`
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

            var r = Math.abs(Math.floor(lerp(argba[0], brgba[0], t)))
            var g = Math.abs(Math.floor(lerp(argba[1], brgba[1], t)))
            var bl = Math.abs(Math.floor(lerp(argba[2], brgba[2], t)))
            var al = Math.abs(Math.floor(lerp(argba[3], brgba[3], t)))
            var s = r.toString(16).padStart(2, "0") +
            g.toString(16).padStart(2, "0") +
            bl.toString(16).padStart(2, "0") +
            al.toString(16).padStart(2, "0")
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
function pointInPoly(poly, pointx, pointy) {
    var i, j;
    var inside = false;
    for (i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        if(((poly[i].y > pointy) != (poly[j].y > pointy)) && (pointx < (poly[j].x-poly[i].x) * (pointy-poly[i].y) / (poly[j].y-poly[i].y) + poly[i].x) ) inside = !inside;
    }
    return inside;
}
function textWidth(str) {
    var w = 0;
    for (var char of str) {
        var code = char.charCodeAt(0)
        var c = sprites[code]
        if (!c) continue;
        w += c.width
    }
    return w;
}
class CanvasThing {
    /**
     * @type {Uint8ClampedArray}
     */
    buffer = null;
    /**
     * @type {cv.ImageData}
     */
    data = null;
    /**
     * @type {cv.Canvas}
     */
    canvas = null;
    /**
     * @type {cv.CanvasRenderingContext2D}
     */
    context = null
    constructor() {
        this.canvas = new cv.Canvas(256, 256)
        this.context = this.canvas.getContext('2d')
        this.data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        this.buffer = this.data.data
    }
    fillPoly(points, color, borderColor) {
        console.log("draw poly fill")
        var pointx = points.map(el => el.x)
        var pointy = points.map(el => el.y)
    
        var minX = Math.floor(Math.min(...pointx))
        var maxX = Math.floor(Math.max(...pointx))
    
        var minY = Math.ceil(Math.min(...pointy))
        var maxY = Math.ceil(Math.max(...pointy))
    
        if (!borderColor) borderColor = color
        for (var y = minY; y < maxY; y++) {
            for (var x = minX; x < maxX; x++) {
                var h = pointInPoly(points, x, y)
                if (h) {
                    var i = (Math.floor(x) + (Math.floor(y) * this.data.width)) * 4
                    this.buffer[i + 0] = color[0]
                    this.buffer[i + 1] = color[1]
                    this.buffer[i + 2] = color[2]
                    this.buffer[i + 3] = color[3]
                }
                //drawText(`${h}`, 0, 0, Infinity, 1, [1, 1, 1, 1], true)
            }
        }
        var prev = points[0]
        for (var i = 1; i < points.length; i++) {
            var point = points[i]
            this.drawLine(prev.x, prev.y, point.x, point.y, borderColor)
            prev = point
        }
    }
    drawLine(x1, y1, x2, y2, color) {
        console.log("draw line")
        var dx = x2 - x1
        var dy = y2 - y1
        var magnitude = Math.sqrt(dx*dx + dy*dy)
        dx /= magnitude
        dy /= magnitude
        var x = x1
        var y = y1
        while ((Math.abs(x - x2) + Math.abs(y - y2)) >= 1) {
            if (x > this.canvas.width || y > this.canvas.height || y < 0 || x < 0) continue
            var i = (Math.floor(x) + (Math.floor(y) * this.data.width)) * 4
            this.buffer[i + 0] = color[0]
            this.buffer[i + 1] = color[1]
            this.buffer[i + 2] = color[2]
            this.buffer[i + 3] = color[3]
            x += dx
            y += dy
        }
    }
    drawSprite(spr, x, y, dither = 0, colMul = [1, 1, 1, 1]) {
        console.log("draw sprite")
        x = Math.floor(x)
        y = Math.floor(y)
        var i = (x + (y * this.data.width)) * 4
        var w = spr.width
        var h = spr.height
        spr = spr.data
        var e = w * h * 4
        var l = 0;
        if (x > this.canvas.width || y > this.canvas.height) return;
        if (x < -spr.width || y < -spr.height) return;
        var d = 0
        for (var j = 0; j < e; j += 4) {
            var r = spr[j] * colMul[0]
            var g = spr[j + 1] * colMul[1]
            var b = spr[j + 2] * colMul[2]
            var a = spr[j + 3] * colMul[3]
            if (a > 10) {
                this.buffer[i + 0] = r
                this.buffer[i + 1] = g
                this.buffer[i + 2] = b
                this.buffer[i + 3] = 255
            }
            d++
            i += 4;
            l++;
            if (l >= w) {
                l = 0;
                i += this.data.width * 4;
                i -= w * 4;
            }
        }
    }
    drawText(str, x, y, maxWidth = Infinity, lineSpacing = 1, colMul = [1, 1, 1, 1], shadow = false, _shadowText = false) {
        console.log("draw text")
        if (shadow) {
            drawText(str, x + 1, y + 1, maxWidth, lineSpacing, [0, 0, 0, 1], false, true)
        }
        x = Math.floor(x)
        y = Math.floor(y)
        var curX = x;
        var curY = y;
        var curW = 0;
        var h = 0;
        var w = 0;
        var colorMode = false;
        var cm = colMul
        var wobbleMode = false;
        var scaleMode = false;
        var wobbleIntensity = 0;
        var wobbleSpeed = 0;
        var wobbleAxis = 0;
        var tallestChar = 8;
        var scale = 1;
        for (var i = 0; i < str.length; i++) {
            var c = str[i]
            if (c == "\uFFFF") {
                colorMode = true;
                var r = str.charCodeAt(++i)
                var g = str.charCodeAt(++i)
                var b = str.charCodeAt(++i)
                cm = [r, g, b, 0xFF]
                continue
            } else if (c == "\uFFF0") {
                colorMode = false;
                cm = colMul
                continue
            }
            if (c == "\uFFDF") {
                wobbleMode = true;
                wobbleIntensity = str.charCodeAt(++i) / 255
                wobbleSpeed = str.charCodeAt(++i) / 255
                wobbleAxis = str.charCodeAt(++i)
                continue;
            } else if (c == "\uFFD0") {
                wobbleMode = false;
                wobbleIntensity = 0;
                wobbleSpeed = 0;
                wobbleAxis = 0;
                continue;
            }
            if (c == "\uFFEF") {
                scaleMode = true;
                scale = str.charCodeAt(++i) / 255
                continue
            } else if (c == "\uFFE0") {
                scaleMode = false;
                scale = 1;
                continue
            }
            var wobbleOfs = 0
            if (wobbleMode) {
                wobbleOfs = Math.sin((Date.now() / 100 + i) * wobbleSpeed) * wobbleIntensity * 4
            }
            var xofs = 0
            var yofs = 0
            if (wobbleAxis == 1) {
                yofs = wobbleOfs
            } else if (wobbleAxis == 2) {
                xofs = wobbleOfs
            } else if (wobbleAxis == 3) {
                xofs = yofs = wobbleOfs
            }
            if (c == "\n") {
                curY += tallestChar + lineSpacing;
                h += tallestChar + lineSpacing;
                curX = x;
                curW = 0;
                continue;
            }
            if (_shadowText) cm = [0, 0, 0, 1]
            var code = c.charCodeAt(0)
            var char = sprites[code]
            if (!char) continue;
            if (scale != 1) char = char.scale(scale)
            if (curW > w) w = curW
            if (curW + char.width >= maxWidth) {
                curY += tallestChar + lineSpacing;
                h += tallestChar + lineSpacing
                tallestChar = 8;
                curX = x;
                curW = 0; 
            }
            if (char.height > tallestChar) tallestChar = char.height
            this.drawSprite(char, curX + xofs, curY + yofs, 0, cm)
            curX += char.width;
            curW += char.width;
        }
        return {width: w, height: h + 8, x, y}
    }
    drawRect(x, y, w, h, c, dithering = 0) {
        x = Math.floor(x)
        y = Math.floor(y)
        w = Math.floor(w)
        h = Math.floor(h)
        var r = c[0]
        var g = c[1]
        var b = c[2]
        var a = c[3]
        var d = 0;
        var i = (x + (y * this.data.width)) * 4
        var e = w * h * 4
        var l = 0
        for (var j = 0; j < e; j += 4) {
            if (a > 10) {
                this.buffer[i + 0] = r
                this.buffer[i + 1] = g
                this.buffer[i + 2] = b
                this.buffer[i + 3] = a
            }
            i += 4;
            l++;
            if (l >= w) {
                l = 0;
                i += this.data.width * 4;
                i -= w * 4;
            }
        }
    }
}
function nearestNeighbor(src, dst) {
    let pos = 0

    for (let y = 0; y < dst.height; y++) {
      for (let x = 0; x < dst.width; x++) {
        const srcX = Math.floor(x * src.width / dst.width)
        const srcY = Math.floor(y * src.height / dst.height)
  
        let srcPos = ((srcY * src.width) + srcX) * 4
  
        dst.data[pos++] = src.data[srcPos++] // R
        dst.data[pos++] = src.data[srcPos++] // G
        dst.data[pos++] = src.data[srcPos++] // B
        dst.data[pos++] = src.data[srcPos++] // A
      }
    }
}
stuff.funi = funi;
function genThing(data) {
    return new Promise(resolve => {
        var thing = new CanvasThing()
        var col = [0x00, 0x70, 0xFF, 0xFF]
        var text = []
        var points = []
        var stats = Object.keys(stuff.stats)
        var w = Math.floor(thing.canvas.width - 64)
        var h = w

        var xpos = thing.canvas.width / 2
        var ypos = thing.canvas.height / 2

        var max = 300
        var step = 360 / stats.length
    
        for (var i = 0; i < stats.length; i++) {
            var dist = 1 * (w / 2)
            dist = clamp(dist, 0, w / 2)
    
            var dx = Math.sin(i * step * (Math.PI / 180))
            var dy = Math.cos(i * step * (Math.PI / 180))
            points.push({x: xpos + dx * dist, y: ypos + dy * dist})
        }
        var bgcol = [0x50, 0x50, 0x50, 0xFF]
        thing.fillPoly(points, bgcol.map((el, i) => {
            if (i == 3) return el / 2
            return el
        }), bgcol)
    
        points = []
    
        var prevpoint = null
        for (var i = 0; i < stats.length; i++) {
            var v = data[stats[i]]
            var label = `${stuff.stats[stats[i]].name}`
            var value = `${data[stats[i]]}`
            var dist = (v / max) * (w / 2)
            dist = clamp(dist, 0, w / 2)
    
            var dx = Math.sin(i * step * (Math.PI / 180))
            var dy = Math.cos(i * step * (Math.PI / 180))
            points.push({x: xpos + dx * dist, y: ypos + dy * dist})
            prevpoint = {x: dx * dist, y: dy * dist}
    
            text.push({
                x: prevpoint.x,
                y: prevpoint.y,
                str: label,
                value: value
            })
        }
        points.push(points[0])
        thing.fillPoly(points, col.map((el, i) => {
            if (i == 3) return el / 2
            return el
        }), col)
        for (var t of text) {
            var magnitude = Math.sqrt(t.x*t.x + t.y*t.y)

            var prevx = t.x
            var prevy = t.y

            t.x += (t.x / magnitude) * 24
            t.y += (t.y / magnitude) * 24

            thing.drawLine(prevx + xpos, prevy + ypos, t.x + xpos, t.y + ypos, col)
            thing.drawRect(prevx - 1, prevy - 1, 2, 2, col)

            var tw = textWidth(t.str)
            thing.drawText(t.str, xpos + t.x - (tw / 2), ypos + t.y - 9)
            var tw = textWidth(t.value)
            thing.drawText(t.value, xpos + t.x - (tw / 2), ypos + t.y)
        }
        var dst = {
            width: thing.canvas.width * 2,
            height: thing.canvas.height * 2,
        }
        dst.data = new Uint8ClampedArray(dst.width * dst.height * 4)
        var src = {
            width: thing.canvas.width,
            height: thing.canvas.height,
            data: thing.buffer
        }
        nearestNeighbor(src, dst)
        thing.canvas.width = dst.width
        thing.canvas.height = dst.height
        thing.data = thing.context.createImageData(thing.canvas.width, thing.canvas.height)
        thing.buffer = thing.data.data
        thing.buffer.set(dst.data, 0)
        thing.context.putImageData(thing.data, 0, 0)
        fs.writeFileSync("bruh.bin", thing.buffer)
        var buf = Buffer.alloc(1024 * 16)
        var i = 0
        var stream = thing.canvas.createPNGStream().on("data", (chunk) => {
            for (var j = 0; j < chunk.length; j++) {
                buf[i++] = chunk[j]
            }
            if (i >= buf.length / 2) {
                buf = Buffer.concat([buf, Buffer.alloc(buf.length)])
            }
        }).on("close", () => {
            buf = buf.slice(0, i + 1)
            resolve(buf)
        })
    })
}
module.exports = {
    name: "test",
    arguments: [
        {
            name: "numbers",
            type: "stringArray"
        }
    ],
    useArgsObject: true,
    /**
     * 
     * @param {Discord.Message} msg 
     * @param {*} args 
     */
    async execute(msg, args) {
        var data = stuff.getClass(msg.author.id, true)
        var buf = await genThing(data)
        msg.channel.send({files: [new Discord.MessageAttachment(buf, "funi.png")]})
        //var f = await funi([{ hp: args.hp, maxhp: args.maxhp, name: args.name, prevhp: args.prevhp, status: args.status }, { hp: Math.floor(Math.random() * 100), maxhp: 100, name: "The Fucking Sun", prevhp: 90, status: ["cringe", "poison"]}])
        //f.resize(1024, jimp.AUTO, jimp.RESIZE_NEAREST_NEIGHBOR)
        //await msg.channel.send({ files: [ new Discord.MessageAttachment(await f.getBufferAsync(jimp.MIME_PNG), "funi.png") ] })
    }
}
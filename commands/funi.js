const { MessageAttachment } = require('discord.js');
var encoder = require('gifencoder')
var fs = require('fs')
var jimp = require('jimp')
var canvas = require('canvas');
const stuff = require('../stuff');
module.exports = {
    name: 'funi',
    requiredPermission: "commands.funi",
    useArgsObject: true,
    arguments: [
        {
            name: "file",
            type: "string",
        }
    ],
    async execute(m, args) {
        var c = fs.readFileSync(args.file)
        var i = 0;
        var w = c.readUInt32LE(i)
        i += 4
        var h = c.readUInt32LE(i)
        i += 4
        var frames = c.readUInt32LE(i)
        i += 4
        await m.channel.send(`Width: ${w}\nHeight: ${h}\nFrames: ${frames}`)
        var frameData = []
        for (var g = 0; g < frames; g++) {
            var b = Buffer.allocUnsafe(w * h * 3)
            for (var j = 0; j < b.length; j++) {
                b[j] = c[i++]
            }
            frameData.push(b)
        }
        console.log(frameData.length)
        var r = await m.channel.send(`Converting RGB to RGBA...`)
        var bufs = []
        for (var frame = 0; frame < frameData.length; frame++) {
            var data = frameData[frame]
            //var ji = await jimp.create(w, h)
            var px = 0;
            var py = 0;
            var b = Buffer.allocUnsafe(w * h * 4)
            for (var i = 0; i < data.length; i += 3) {
                //ji.setPixelColor(parseInt(data.readUIntBE(i, 3).toString(16).padStart(6, "0") + "ff", 16), px++, py)
                //if (px >= w) {
                    //    px = 0;
                    //    py++
                    //}
                    b[px++] = data[i + 0]
                    b[px++] = data[i + 1]
                    b[px++] = data[i + 2]
                    b[px++] = 255
                }
                var buf = b
                bufs.push(buf)
            }
            
        var e = new encoder(w, h)
        e.start()
        e.setDelay(1000 / 30)
        e.setQuality(9)
        e.setRepeat(0)
        await r.edit(`Converting to GIF...`)
        var f = 0;
        var interval = 0;
        var ca = new canvas.Canvas(w, h)
        var ctx = ca.getContext('2d')
        await stuff.repeat((i) => {
            var b = bufs[i]
            var dat = ctx.createImageData(w, h)
            dat.data.set(b, 0)
            ctx.putImageData(dat, 0, 0)
            e.addFrame(ctx)
            f++
            console.log(`${f}/${frames}`)
        }, frames)
        e.finish()

        var o = e.out.getData()
        console.log(o.length)
        fs.writeFileSync(`last.gif`, o)
        await m.channel.send({ files: [new MessageAttachment(o, "funi.gif")] })
    }
}
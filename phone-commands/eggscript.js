const { eggscriptInstructions } = require('../stuff')
var stuff = require('../stuff')
module.exports = {
    name: "eggscript",
    execute(message, args, phoneData, slot) {
        console.log(args)
        var eggscriptParser = (str = "") => {
            if (!phoneData.vars) phoneData.vars = {}
            console.log(args)
            phoneData.vars.charge = phoneData.battery.charge
            phoneData.vars.batteryQuality = phoneData.battery.quality
            var instructions = str.split(';')
            for (const h of instructions) {
                var _args = h.split(' ')
                var a = [];
                var cmd = _args.shift().trim().toLowerCase()
                if (cmd == "eggscript") continue;
                _args.forEach((el, i) => {
                    phoneData.vars.random = Math.random()
                    console.log(`Arg: ${el}, Index: ${i}`)
                    Object.keys(phoneData.vars).forEach(v => {
                        console.log(`${el}, var:${v}, ${el.replace(`var:${v}`, phoneData.vars[v])}`)
    
                        el = el.replace(`var:${v}`, phoneData.vars[v])
                    })
                    a[i] = el
                })
                console.log(a)
                console.log(eggscriptInstructions)
                eggscriptInstructions[cmd](message, a, phoneData, slot)
            }
            delete phoneData.vars.file
        }
        var content = stuff.readPhoneFile(message.author.id, slot, args[0])
        eggscriptParser(content)
    }
}
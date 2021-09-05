var stuff = require('../stuff')
module.exports = {
    name: "merge",
    execute(message, args, _phoneData, slot) {
        var target = args[0]
        var files = args.slice(1)
        var hh = []
        var h = ""
        for (const file of files) {
            var t = stuff.readPhoneFile(message.author.id, slot, file)
            hh.push(`${file}=${t}`)
        }
        h = hh.join(String.fromCharCode(99999999))
        stuff.writePhoneFile(message.author.id, slot, target, h)
        for (const file of files) {
            stuff.deletePhoneFile(message.author.id, slot, file)
        }
    }
}
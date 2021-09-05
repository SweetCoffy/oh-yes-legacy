var stuff = require('../stuff')
module.exports = {
    name: "rename",
    execute(message, args, phoneData, slot) {
        if (args.length < 2) throw `no`
        var content = stuff.readPhoneFile(message.author.id, slot, args[0])
        stuff.deletePhoneFile(message.author.id, slot, args[0])
        stuff.writePhoneFile(message.author.id, slot, args[1], content)
        message.channel.send(`File \`${args[0]}\` renamed to \`${args[1]}\``)
    }
}
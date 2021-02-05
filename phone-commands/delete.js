var stuff = require('../stuff')
module.exports = {
    name: "delete",
    execute(message, args, phoneData, slot) {
        if (args.length < 1) throw 'no'
        stuff.deletePhoneFile(message.author.id, slot, args[0])
        message.channel.send(`File \`${args[0]}\` deleted succesfully`)
    }
}
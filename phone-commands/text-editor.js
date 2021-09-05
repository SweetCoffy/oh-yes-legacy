var stuff = require('../stuff')
module.exports = {
    name: 'text-editor',
    execute (message, args, phoneData, slot) {
        if (args[0] == 'read') {
            message.channel.send({content: stuff.readPhoneFile(message.author.id, slot, args[1]), code: true, split: true})
        } else if (args[0] == 'write') {
            stuff.writePhoneFile(message.author.id, slot, args[1], args.slice(2).join(' '))
            message.channel.send(`File edited succesfully`)
        }
    }
}
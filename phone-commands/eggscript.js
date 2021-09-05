const { eggscriptInstructions } = require('../stuff')
var stuff = require('../stuff')
module.exports = {
    name: "eggscript",
    execute(message, args, phoneData, slot, eggContext) {
        console.log(args)
        var content = stuff.readPhoneFile(message.author.id, slot, args[0])
        var result = stuff.eggscript(content, eggContext)
        message.channel.send({content: require('util').inspect(result), code: "js", split: true})
        stuff.addMoney(message.author.id, 1, 'braincell')
    }
}
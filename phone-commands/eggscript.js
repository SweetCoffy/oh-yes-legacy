const { eggscriptInstructions } = require('../stuff')
var stuff = require('../stuff')
module.exports = {
    name: "eggscript",
    execute(message, args, phoneData, slot) {
        console.log(args)
        var content = stuff.readPhoneFile(message.author.id, slot, args[0])
        stuff.eggscriptInterpreter(message, phoneData, content, slot)
    }
}
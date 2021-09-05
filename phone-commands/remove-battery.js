var stuff = require('../stuff')
module.exports = {
    name: "remove-battery",
    minVer: 0.00001,
    execute(message, args, phoneData, slot) {
        if (phoneData.battery) {
            stuff.addItem(message.author.id, 'battery', phoneData.battery)
            stuff.setItemProperty(message.author.id, slot, 'battery', undefined)
            message.channel.send(`Successfully remoov'd the battery`)
        } else throw `lol no`
    }
}
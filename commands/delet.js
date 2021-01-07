const RestrictedCommand = require('../RestrictedCommand')
const stuff = require('../stuff')
module.exports = new RestrictedCommand('delet', async(message, args) => {
    var amount = stuff.clamp(args.amount, 1, 100)
    await message.delete();
    var messages = await message.channel.bulkDelete(amount)
    var msg = await message.channel.send({ embed: {
            title: "oh yes",
            description: `Succesfully deleted ${messages.size} messages`,
            color: 0x22ff22,
    }})
    msg.delete({timeout: 7000})
    
}, 'MANAGE_MESSAGES', 'Bulk deletes messages').argsObject().addArgumentObject({
    name: "amount",
    type: "positiveInt",
    optional: true,
    default: 100,
    description: "The amount of messages to delete, cannot be higher than 100",
}).setProperty('aliases', [ 'delete', 'clear' ])
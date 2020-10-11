const { Channel, TextChannel, Message } = require("discord.js")
const CommandError = require("../CommandError")

module.exports = {
    name: "delet",
    description: "bulk **delet**es messages lol",
    requiredPermission: "commands.delet",
    usage: "delet <amount>",
    execute(message, args) {
        var amount = parseInt(args[0])
        if (!amount) throw new CommandError("Invalid number", `Cannot use \`${amount}\` as a delete amount`, "next time try using a valid number")

        message.channel.bulkDelete(amount).then(() => {
            message.channel.send(`✅ Succesfully deleted **${amount}** messages!`).then(message => {
                message.delete({timeout: 6000, reason: "eggs"})
            })
        })

    }
}
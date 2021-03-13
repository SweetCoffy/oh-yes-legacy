const CommandError = require("../CommandError")
const stuff = require("../stuff")

module.exports = {
    name: "pay",
    description: "Self explanatory",
    arguments: [
        {
            name: "user",
            type: "user",
            description: "Who to pay money"
        },
        {
            name: "amount",
            type: "formattedNumber",
            description: "The amount to pay"
        },
        {
            name: "currency",
            type: "string",
            optional: true,
            default: "ip"
        }
    ],
    useArgsObject: true,
    execute(message, args) {
        var cur = stuff.currencies[args.currency]
        if (!cur) throw `Invalid currency`
        var money = stuff.getMoney(message.author.id, args.currency)
        if (money < args.amount) throw new CommandError("e", "You can't get money from nowhere")
        if (args.amount < 0) throw new CommandError("e", "You can't steal money")
        stuff.addMoney(args.user.id, args.amount, args.currency)
        stuff.addMoney(message.author.id, -args.amount, args.currency)
        message.channel.send(`Paid ${stuff.format(args.amount)} ${cur.icon} to ${args.user} lol`);
    }
}
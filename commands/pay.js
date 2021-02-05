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
        }
    ],
    useArgsObject: true,
    execute(message, args) {
        var hasReverseCard = stuff.getInventory(args.user.id).map(el => el.id).includes('reverse-card');
        var money = stuff.getPoints(message.author.id)
        if (money < args.amount) throw new CommandError("e", "You can't get money from nowhere")
        if (args.amount < 0) throw new CommandError("e", "You can't steal money")
        stuff.addPoints(args.user.id, hasReverseCard ? -args.amount : args.amount, `Got paid from ${message.author}`)
        stuff.addPoints(message.author.id, hasReverseCard ? args.amount : -args.amount, `Paid to ${args.user}`)
        message.channel.send(`Paid ${stuff.format(hasReverseCard ? -args.amount : args.amount)} <:ip:770418561193607169> to ${args.user} lol`);
    }
}
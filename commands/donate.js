const CommandError = require("../CommandError");
const stuff = require("../stuff");

module.exports = {
    name: "donate",
    description: "donate money to everyone else lol",
    useArgsObject: true,
    category: "economy",
    arguments: [
        {
            name: "amount",
            type: "formattedNumber"
        }
    ],
    execute(message, args) {
        var amount = Math.abs(args.amount);
        
        if (amount > stuff.getPoints(message.author.id)) throw new CommandError("Not enough money", `Cannot donate more money than you currently have`)
        var entries = Object.entries(stuff.db.getData("/")).filter(el => {
            return el[0] != message.author.id;
        })
        var amountPerUser = amount / (entries.length)
        entries.forEach(el => {
            stuff.addPoints(el[0], amountPerUser, `Donation from ${message.author}`)
            stuff.addPoints(message.author.id, -amountPerUser, `Donated to <@${el[0]}>`)
            stuff.addDonated(message.author.id, amountPerUser)
        })
        
        
        
        message.channel.send(`Distributed ${stuff.format(amount)} between ${entries.length} users!`);
    }
}
const CommandError = require("../CommandError");
const stuff = require("../stuff");

module.exports = {
    name: "donate",
    description: "donate money to everyone else lol",
    usage: "donate <amount>",
    execute(message, args) {
        var amount = parseFloat(args[0]);
        if (!amount || amount < 0) throw new CommandError("Invalid Number", "Cannot donate amounts like `NaN`, `0` or any negative number.")
        if (amount > stuff.getPoints(message.author.id)) throw new CommandError("Not enough money", `Cannot donate more money than you currently have.`)
        var entries = Object.entries(stuff.db.getData("/")).filter(el => {
            return el[0] != message.author.id;
        })
        var amountPerUser = amount / (entries.length)
        entries.forEach(el => {
            stuff.addPoints(el[0], amountPerUser)
            stuff.addPoints(message.author.id, -amountPerUser)
            stuff.addDonated(message.author.id, amountPerUser)
        })
        
        
        
        message.channel.send(`Distributed ${stuff.format(amount)} between ${entries.length} users!`);
    }
}
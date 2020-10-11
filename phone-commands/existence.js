const stuff = require("../stuff");

module.exports = {
    name: "existence",
    author: "god",
    package: "h",
    execute (message, args, phoneData, slot) {
        

        
       



        if (args[0] == "buy") {

            var id = message.author.id;
            var p = stuff.getPoints(id);

            if (p < stuff.existencePrice) {
                throw `you need ${stuff.format(stuff.existencePrice - p)} Internet Points\™️ to renew Existence`
            } else {
                stuff.addPoints(id, -stuff.existencePrice);
                stuff.setExistenceExpiration(id, slot, new Date().getTime() + 60000)
                message.channel.send("You renewed Existence!");
            }

        } else if (args[0] == "remaining") {
            message.channel.send(`You have ${(stuff.clamp(phoneData.existence.expires - new Date().getTime(), 0, Infinity) / 1000).toFixed(1)} seconds of existence left`);
        } else {
            if (!phoneData.existence) {
                message.channel.send("starting your free trial of existence...");
                stuff.setExistenceExpiration(message.author.id, slot, new Date().getTime() + 10000);
            } 
        }

        phoneData = stuff.getInventory(message.author.id)[slot].extraData;
        
        var now = new Date().getTime();
        var expired = false;
        if (now > phoneData.existence.expires) {
            stuff.setExistenceExpiration(message.author.id, slot, undefined, true)
            expired = true;
            message.channel.send(`your copy of existence has expired, please run \`buy\` to renew this copy of existence`);
        }

        phoneData = stuff.getInventory(message.author.id)[slot].extraData;

        if (!expired) {

            if (args[0] == "shop+") {
                var buyCmd = message.client.commands.get("buy");
                var _args = args.slice(1);
                buyCmd.execute(message, _args, [], {}, 0.4)
            }

        } else {
            throw "this is a Existence subscription only command"
        }
        
    }
}
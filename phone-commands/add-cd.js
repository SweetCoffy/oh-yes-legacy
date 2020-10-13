const stuff = require("../stuff");

module.exports = {
    name: "add-cd",
    computerOnly: true,
    execute(message, args, data, slot) {
        var cd = parseInt(args[0])
        if (!cd) throw "e";
        var _cd = stuff.getInventory(message.author.id)[cd];
        if (!stuff.shopItems[_cd.id].addedPackage) throw "e"
        stuff.setItemProperty(message.author.id, slot, "packages[]", stuff.shopItems[_cd.id].addedPackage)
        stuff.removeItem(message.author.id, _cd.id);
        stuff.setItemProperty(message.author.id, slot, "discs[]", {
            name: stuff.shopItems[_cd.id].addedPackage
        })
        message.channel.send(`You added the package \`${stuff.shopItems[_cd.id].addedPackage}\` by using \`${_cd.name}\``);
    }
}
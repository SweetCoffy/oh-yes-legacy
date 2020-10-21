const CommandError = require("../CommandError");
const stuff = require("../stuff");

module.exports = {
    name: "equip",
    description: "equips an item lol",
    usage: "equip <slot>",
    execute(message, args) {
        var slot = parseInt(args[0]);
        if (slot == NaN || slot < 0 || slot > stuff.getInventory(message.author.id).length - 1) throw new CommandError("Invalid number", `\`${slot}\` isn't a valid slot!`)
        stuff.addEquipment(message.author.id, slot);
        message.channel.send(`ha ha yes you equipped the item at slot \`${slot}\``);
    }
}
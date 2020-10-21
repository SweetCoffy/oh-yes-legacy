const CommandError = require("../CommandError");
const stuff = require("../stuff");

module.exports = {
    name: "unequip",
    description: "unequips an item lol",
    usage: "unequip <slot>",
    execute(message, args) {
        var slot = parseInt(args[0]);
        if (slot == NaN || slot < 0 || slot > stuff.getEquipment(message.author.id).length - 1) throw new CommandError("Invalid number", `\`${slot}\` isn't a valid slot!`)
        stuff.removeEquipment(message.author.id, slot);
        message.channel.send(`ha ha yes you unequipped the item at slot \`${slot}\``);
    }
}
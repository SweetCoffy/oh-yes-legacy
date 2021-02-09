var stuff = require('../../stuff')
module.exports = {
    name: "Phone",
    icon: ":mobile_phone:",
    price: 5000,
    unstackable: true,
    inStock: 9999999999,
    rarity: stuff.rarity.blue,
    type: "Other",
    extraData: {
        battery: undefined,
        files: {'files.txt': `How 2 files:\nuse 'text-editor read <file name>' to read a file, 'text-editor write <file name> <contents>' to write to an existing file or create one\n\nHow 2 Eggscript:\neggscript is the bootleg 'programming language' you can use in phones, it's more like a .bat kind of thing and it can run any phone command\nthe syntax is kinda simple, spaces are argument separators and semicolons are instruction separators`},
        capacity: 65536,
        used: 408,
    },
    onUse: function(user, message, args, slot) {
        var phoneData = stuff.getInventory(user)[slot].extraData || {}; 
        var u = message.guild.members.cache.get(user).user;
        if (!phoneData.battery) throw "You need a battery!!!1!1!!1!!"
        if (phoneData.battery.charge <= 0) {
            stuff.addItem(message.author.id, 'battery', phoneData.battery)
            stuff.setItemProperty(message.author.id, slot, 'battery', undefined)
            return message.channel.send(`The battery is ded and so it was automatically removed`)
        }
        var cmdName = args[0];
        var _args = args.slice(1);
        var cmd = stuff.phoneCommands.get(cmdName);
        var b = stuff.readItemData(user, slot).battery
        b.charge -= (Math.random() * 6) / (b.quality ?? 1);
        stuff.writeItemData(user, slot, { battery: b })  
        if (!cmd) {
            throw `The command \`${args[0]}\` is not available`;
        } else {
            return cmd.execute(message, _args, phoneData, slot);
        }
        return false;
    }
}
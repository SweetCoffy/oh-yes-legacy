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
        files: {},
        capacity: 65536,
        used: 0,
    },
    onUse: function(user, message, args, slot) {
        if (stuff.getMoney(user, "braincell") < 100) throw `You need at least 100 braincells in order to use this phone`
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
        var eggscriptContext = {
            writeFile(filename, data) {
                stuff.writePhoneFile(user, slot, filename, data + "")
            },
            readFile(filename) {
                return stuff.readPhoneFile(user, slot, filename)
            },
            deleteFile(filename) {
                stuff.deletePhoneFile(user, slot, filename)
            }
        }
        var b = stuff.readItemData(user, slot).battery
        b.charge -= (Math.random() * 6) / (b.quality ?? 1);
        stuff.writeItemData(user, slot, { battery: b })  
        if (!cmd) {
            throw `The command \`${args[0]}\` is not available`;
        } else {
            return cmd.execute(message, _args, phoneData, slot, eggscriptContext);
        }
        return false;
    }
}
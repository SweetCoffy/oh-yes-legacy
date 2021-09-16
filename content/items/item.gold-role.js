const stuff = require("../../stuff");

module.exports = {
    name: "Gold Role",
    description: "It's a golden role",
    icon: "🟡",
    rarity: stuff.rarity.yellow,
    price: 1000000,
    onUse(user, msg, args, slot) {
        stuff.removeItem(user, "gold-role");
        if (msg.guild.id != "728718708079460424") {
            throw `It did absolutely nothing`
        } else {
            if (msg.member.roles.cache.has("886020655433277470")) throw `You already have the role`
            msg.member.roles.add("886020655433277470")
        }
    }
}
const stuff = require("../../stuff");

module.exports = {
    name: "Stat Changer",
    icon: "✏️",
    price: 50000000,
    unlisted: true,
    color: stuff.rarity.red,
    extraInfo: "Use this item to change your stats\nUsage: `;use stat-changer <times> <stat> <+|->`",
    onUse(user, m_, a) {
        var stat = a.shift()
        var p = ""
        stuff.removeItem(user, "stat-changer")
        switch (stat.toLowerCase()) {
            case "speed":
                p = "speedSP"
                break;
            case "attack":
                p = "attackSP"
                break;
            case "defense":
                p = "defenseSP"
                break;
            case "hp":
                p = "healthSP"
                break;
        }
        if (!p) throw `Unknown stat: \`${stat}\``
        var sign = a.shift()
        if (sign == "+") {
            stuff.db.data[user][p] = Math.min(Math.max((stuff.db.data[user][p] || 0) + 1, 0), 64)
        } else if (sign == "-") {
            stuff.db.data[user][p] = Math.min(Math.max((stuff.db.data[user][p] || 0) - 1, 0), 64)
        } else throw `Unknown sign: \`${sign}\``
    }
}
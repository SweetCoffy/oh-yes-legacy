const stuff = require("../../stuff")

if (!stuff.bank) stuff.bank = {
    cards: {}
}

module.exports = {
    name: "Credit Card",
    icon: "💳",
    price: 6969,
    extraInfo: "Useless by itself, link it to your phone with \`;use phone 1 link credit-card\` to use it in the bank",
    extraData: {
        get id() {
            return stuff.randomString(8)
        },
        get pass() {
            return stuff.randomString(8)
        }
    },
    onUse(user, msg, a, slot) {
        var d = stuff.db.data[user].inventory[slot]
        var bankInfo = stuff.bank.cards[d.extraData.id]
        msg.reply(`ID: ${d.extraData.id}\n${bankInfo ? `IP: ${stuff.format(bankInfo.ip)}` : "Bank info not available"}`)
        throw ''
    }
}
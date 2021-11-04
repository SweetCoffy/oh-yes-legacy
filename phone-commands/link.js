const stuff = require("../stuff")

stuff.createCard = function(id, pass) {
    stuff.bank.cards[id] = {
        id,
        pass,
        ip: 0n,
        logs: [],
    }
}

module.exports = {
    name: "link",
    execute(msg, args, data, slot) {
        var s = stuff.db.data[msg.author.id].inventory.find(el => el.id == args[0])
        if (!s) throw `no`
        if (s.id != "credit-card") throw `the item isn't a credit card, you fucktard`
        stuff.writePhoneFile(msg.author.id, slot, "bank.json", JSON.stringify({ id: s.extraData.id, pass: s.extraData.pass }))
        if (!stuff.bank.cards[s.extraData.id]) stuff.createCard(s.extraData.id, s.extraData.pass)
        msg.reply(`Link'd the credit card, use the \`bank\` phone command to see info`)
    }
}
const stuff = require("../stuff")
var { Message, MessageActionRow, MessageButton } = require('discord.js')
module.exports = {
    name: "bank",
    /**
     * 
     * @param {Message} msg 
     * @param {String[]} args 
     * @param {*} data 
     * @param {number} slot 
     */
    async execute(msg, args, data, slot) {
        var g = stuff.readPhoneFile(msg.author.id, slot, "bank.json")
        try {
            JSON.parse(g)
        } catch (er) {
            var e = g.split("\n")
            stuff.writePhoneFile(msg.author.id, slot, "bank.json", JSON.stringify({
                id: e[0],
                pass: e[1]
            }))
            g = stuff.readPhoneFile(msg.author.id, slot, "bank.json")
        }
        var e = JSON.parse(g)
        if (stuff.bank.cards[e.id].pass != e.pass) throw `Incorrect password`
        var bank = stuff.bank.cards[e.id]
        var cmd = args.shift()
        if (cmd == "deposit") {
            var amt = stuff.conversions.formattedNumber(args.shift())
            if (stuff.getMoney(msg.author.id) < amt) throw `You can't deposit more than you currently have!`
            stuff.addMoney(msg.author.id, -amt)
            bank.ip += BigInt(Math.floor(amt))
            msg.reply(`Deposited ${stuff.format(amt)}`)
        } else if (cmd == "withdraw") {
            var amt = stuff.conversions.formattedNumber(args.shift())
            if (bank.ip < amt) throw `You can't withdraw more than you currently have!`
            stuff.addMoney(msg.author.id, amt)
            bank.ip += BigInt(Math.floor(-amt))
            msg.reply(`Withdrew ${stuff.format(amt)}`)
        } 
        var embed = {
            title: `Bancc`,
            description: `ID: \`${bank.id}\`\nPassword: \`${"*".repeat(e.pass.length)}\`\nIP: ${stuff.format(bank.ip)}`
        }
        var m = await msg.channel.send({embeds: [embed], components: [new MessageActionRow({ components: [
            new MessageButton({ customId: "pass", label: "Get password", style: "DANGER" })
        ] })]})
        var i = await m.awaitMessageComponent({filter: (i) => {
            if (i.user.id != msg.author.id) {
                i.reply({ ephemeral: true, content: "This isn't for you, you fucking egger" })
                return false;
            }
            return true;
        }})
        await i.reply({ephemeral: true, content: `Password: ${bank.pass}`})
        
    }
}
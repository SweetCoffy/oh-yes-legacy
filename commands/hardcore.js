const { MessageActionRow, MessageButton } = require("discord.js");
const stuff = require("../stuff");

module.exports = {
    name: "hardcore",
    aliases: ["hc", "hard"],
    async execute(msg) {
        if (stuff.db.data[msg.author.id].hardcore) throw `lol no`
        var m = await msg.reply({
            content: `Enabling hardcore mode will erase your data, and if you die, it will be erased aswell\nAre you sure to enable hardcore mode?`,
            components: [new MessageActionRow({ components: [
                new MessageButton({ style: "DANGER", label: "Yes", customId: "yes" }),
                new MessageButton({ style: "SUCCESS", label: "No", customId: "no" })
            ] })]
        })
        var i = await m.awaitMessageComponent({ filter: (i) => {
            if (i.user.id != msg.author.id) {
                i.reply({
                    ephemeral: true,
                    content: `Fucking egger`
                })
                return false;
            }
            return true;
        } })
        if (i.customId == "yes") {
            await i.reply("Ok, don't tell me i didn't warn you")
            stuff.createData(msg.author.id, true)
            stuff.addMedal(msg.author.id, stuff.medals.hc)
        } else if (i.customId == "no") {
            await i.reply("k")
        }
    }
}
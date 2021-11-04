const stuff = require("../stuff")

module.exports = {
    name: "reload",
    description: "reloads all commands lol",
    requiredPermission: 'commands.reload',
    category: "bot",
    async execute(message, _a, _b, a) {
        console.clear()
        var m = await message.channel.send(`Loading commands...`)
        var c = Object.entries(stuff.loadCommands())
        await m.edit("Loading content...")
        stuff.loadContent()
        stuff.loadPhoneCommands()
        stuff.updateContent()
        stuff.updateVenezuelaMode()
        stuff.updateStonks()
        if (!a.noslash) {
            await m.edit("Loading slash commands...")
            await stuff.loadSlashCommands()
        }
        var embed = {
            title: `Random crap has been reloaded`,
            color: 0x177dd1,
        }
        if (c.length > 0) {embed.fields = [{
            name: `The following commands had some trouble loading:`,
            value: `${c.map(el => `**${el[0]}**:\n${el[1].name || "Error"}: ${el[1].message || "Message is missing"}\n${el[1].stack || "Stack trace is missing"}`).join("\n")}`
        }];embed.color = 0xff0000}
        await m.edit({embed: embed});
    }
}
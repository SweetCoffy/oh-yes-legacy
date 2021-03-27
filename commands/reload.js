const stuff = require("../stuff")

module.exports = {
    name: "reload",
    description: "reloads all commands lol",
    requiredPermission: 'commands.reload',
    execute(message) {
        console.clear()
        message.channel.send(`Reloading...`)
        var c = Object.entries(stuff.loadCommands())
        stuff.loadContent()
        stuff.loadPhoneCommands()
        stuff.updateContent()
        stuff.updateVenezuelaMode()
        stuff.updateStonks()
        var embed = {
            title: `Commands and items have been reloaded`,
            color: 0x177dd1,
        }
        if (c.length > 0) {embed.fields = [{
            name: `The following commands had some trouble loading:`,
            value: `${c.map(el => `**${el[0]}**:\n${el[1].name || "Error"}: ${el[1].message || "Message is missing"}\n${el[1].stack || "Stack trace is missing"}`).join("\n")}`
        }];embed.color = 0xff0000}
        message.channel.send({embed: embed});
    }
}
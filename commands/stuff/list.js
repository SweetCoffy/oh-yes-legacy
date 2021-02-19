const stuff = require("../../stuff")

module.exports = {
    name: "list",
    onExecute(message) {
        message.channel.send({ code: true, split: true, content: "| Enabled |           ID           |           File name           |     Type     |\n" + Object.values(stuff.loadedContent).map(el => `|${(el.enabled ? "Yes" : "No").padEnd(9)}|${el.id.padEnd(24)}|${el.fullName.padEnd(31)}|${el.type.padEnd(14)}|`).join("\n")})
    }
}
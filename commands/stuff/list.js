const stuff = require("../../stuff")

module.exports = {
    name: "list",
    onExecute(message) {
        message.channel.send("```\n| Enabled |       ID       |       File name       |     Type     |\n" + Object.values(stuff.loadedContent).map(el => `|${(el.enabled ? "Yes" : "No").padEnd(9)}|${el.id.padEnd(16)}|${el.fullName.padEnd(23)}|${el.type.padEnd(14)}|`).join("\n") + "\n```")
    }
}
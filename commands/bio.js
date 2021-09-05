const stuff = require("../stuff")

module.exports = {
    name: "bio",
    useArgsObject: true,
    supportsQuoteArgs: true,
    arguments: [
        {
            name: "text",
            type: "string"
        }
    ],
    execute(message, args) {
        var t = args.text.slice(0, 1024)
        stuff.db.push(`/${message.author.id}/bio`, t)
        message.channel.send(`Bio set to "${t}"`)
    }
}
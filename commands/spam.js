const stuff = require("../stuff");
module.exports = {
    name: "spam",
    requiredPermission: "commands.spam",
    useArgsObject: true,
    arguments: [
        {
            name: "count",
            type: "number",
        },
        {
            name: "text",
            type: "string",
        }
    ],
    async execute(message, args) {
        try {
            if (args.text.includes("@everyone") || args.text.includes("@here")) throw "***no***"
            for (let i = 0; i < args.count; i++) {
                await message.channel.send (args.text);
            }
        } catch (err) {
            stuff.sendError(message.channel, err)
        }
    }
}
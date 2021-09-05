var stuff = require('../stuff')
module.exports = {
    name: "announce",
    description: `Announces something in the bot announcements channel`,
    requiredPermission: "commands.announce",
    supportsQuoteArgs: true,
    category: "moderation",
    useArgsObject: true,
    arguments: [
        {
            name: "message",
            type: "string"
        },
        {
            name: "title",
            type: "string",
            optional: true,
            default: "Announcement"
        },
        {
            name: "footer",
            type: "string",
            optional: true,
            default: ""
        },
        {
            name: "image",
            type: "string",
            optional: true,
            default: ""
        },
        {
            name: "thumbnail",
            type: "string",
            optional: true,
            default: ""
        },
    ],
    async execute(message, args) {
        var c = message.client.channels.resolve(stuff.getConfig('announcements'))
        c.send({embed: {
            title: args.title,
            description: args.message,
            footer: { text: args.footer },
            thumbnail: { url: args.thumbnail },
            image: { url: args.image },
        }})
    }
}
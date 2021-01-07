const stuff = require("../stuff");

module.exports = {
    name: "say",
    useArgsObject: true,
    arguments: [
        {
            name: "text",
            type: "string",
            optional: true,
            default: "",
        }
    ],

    execute (message, args, _extraArgs, extraArgs) {
        message.channel.send({embed: {
            title: `${message.author.username} sez`,
            color: 0x2244ff,
            description: args.text
        }})
    }
}
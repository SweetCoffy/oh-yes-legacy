const stuff = require("../stuff")

module.exports = {
    name: "medal",
    useArgsObject: true,
    category: "economy",
    arguments: [
        {
            name: "medal",
            type: "string",
            description: "The medal to show info about",
            optional: true,
            default: "all"
        }
    ],
    execute(message, args) {
        if (args.medal == "all") {
            var embed = {
                title: "Medal list",
                color: 0x0398fc,
                description: Object.values(stuff.medals).map(el => `${el.icon} \`${el.id}\` **${el.name}**`).join('\n')
            }
            message.channel.send({ embed: embed })
        } else {
            var medal = stuff.medals[args.medal]
            if (!medal) throw "e";
            var embed = {
                color: 0x0398fc,
                title: `${medal.icon} ${medal.name}`,
                description: `${medal.description}`
            }
            message.channel.send({ embed: embed })
        }
    }
}
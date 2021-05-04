var stuff = require('../stuff')
module.exports = {
    name: "eggdocs",
    useArgsObject: true,
    category: "eggscript",
    arguments: [
        {
            name: "name",
            type: "string"
        }
    ],
    execute(message, args) {
        if (!stuff.docs[args.name]) {
            var embed = {
                title: `eggscript stuff list`,
                description: Object.keys(stuff.docs).map(el => `\`${el}\``).join(", ")
            }
            message.channel.send({embed: embed})
            return;
        }
        var thing = stuff.docs[args.name];
        var embed = {
            title: `(${thing.type}) ${thing.displayName || args.name}`,
            description: `${thing.description}`,
        }
        if (thing.args) {
            embed.title += `(${thing.args.map(el => `${el.name} : ${el.type}${el.optional ? "?" : ""}`).join(", ")})`
        }
        message.channel.send({embed: embed})
    }
}
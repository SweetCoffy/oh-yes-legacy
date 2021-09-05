const stuff = require("../stuff")

module.exports = {
    name: "search",
    category: "help",
    useArgsObject: true,
    arguments: [
        {
            name: "query",
            type: "string",
            description: `Text or regex to search for`
        }
    ],
    execute(message, args) {
        args.query = args.query.replace(/ /g, '-').toLowerCase()
        var r = message.client.commands.filter(el => el.name.includes(args.query))
        if (r.size < 1) throw `No results found`
        var embed = {
            title: `Search results: ${args.query} (${stuff.clamp(r.size, 0, 20)} displayed out of ${r.size})`,
            description: r.map(el => {
                var matches = [...el.name.matchAll(new RegExp(args.query, 'g'))]
                return { command: el, matches: matches || [] }
            }).sort((a, b) => b.matches.length - a.matches.length).map(el => `\`${el.command.name}\` (${el.matches.length} matches, in \`${el.command.category || "commands"}\`)`).slice(0, 20).join('\n')
        }
        message.channel.send({embed: embed})
    }
}
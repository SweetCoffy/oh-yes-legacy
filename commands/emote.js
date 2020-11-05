const { Guild, Collection } = require("discord.js");
const CommandError = require("../CommandError");

module.exports = {
    name: "emote",
    description: "shows all emojis that match the search query",
    usage: "emote <query>",
    execute(message, args, extraArgs) {
        var query = args.join(" ");
        if (args.length < 1) throw new CommandError("Void", "You can't search void")
        var serverEmojis = message.guild.emojis.cache;
        var matching = serverEmojis.filter(v => {
            
            
            return v.id.includes(query) || v.name.includes(query);
        })

        
        if (matching.size < 1) throw new CommandError("No results found", `Could not find search results for \`${query}\``)
        
        var emojiNames = [];
        var page = (parseInt(extraArgs[0]) || 1) - 1
        var startFrom = 0 + (10 * page);

        matching.forEach(v => {
            emojiNames.push(`${v.animated ? "(nitro only)" : ""} ${v}\n> id: ${v.id}\n> name: **${v.name}**`)
        });

        var embed = {
            title: "search results",
            description: emojiNames.slice(startFrom, startFrom + 10).join("\n\n"),
            footer: {
                text: "page " + (page + 1)
            }
        }

        message.channel.send({embed: embed});

    }
}
var { CommandInteraction, ApplicationCommand } = require('discord.js')
var { commandUsage } = require('../stuff')
module.exports = {
    type: "CHAT_INPUT",
    name: "command-usage",
    description: "Shows command usage info",
    /**
     * @type {import('discord.js').ApplicationCommandOption[]}
     */
    options: [
        {
            name: "sort",
            description: "The funi sort mode",
            type: "STRING",
            required: false,
            choices: [{name: "most used", value: "most_used"}, {name: "least used", value: "least_used"}, {name: "none", value: "none"}],
        }
    ],
    /**
     * 
     * @param {CommandInteraction} i 
     */
    async run(i) {
        var s = i.options.getString("sort", false) || "most_used"
        var u = commandUsage
        function funiSort(a, b) {
            if (s == "none") return 0;
            if (s == "least_used") return a[1] - b[1]
            return b[1] - a[1]
        }
        var clist = i.client.commands.map(e => [e.name, u.commands[e.name] || 0])
        .sort(funiSort)
        .map(el => `${el[0].padEnd(16, " ")} : ${el[1].toString().padStart(6, " ")} (${((el[1] / u.total) * 100).toFixed(1).padEnd(5, " ")}%)`)
        var slist = i.client.slashCommands.map(e => [e.name, u.slash_commands[e.name] || 0])
        .sort(funiSort)
        .map(el => `${el[0].padEnd(16, " ")} : ${el[1].toString().padStart(6, " ")} (${((el[1] / u.total) * 100).toFixed(1).padEnd(5, " ")}%)`)
        await i.reply({
            embeds: [{
                title: `Command usage`,
                description: `Total: ${u.total}\nErrors: ${u.errors}\nTotal messages: ${u.messages} (${((u.commands.TOTAL / u.messages) * 100).toFixed(1)}% text commands)`,
                fields: [
                    {
                        name: `Commands (Total: ${u.commands.TOTAL})`,
                        value: "```\n" + clist.slice(0, 20).join("\n") + "\n```",
                    },
                    {
                        name: `Slash commands (Total: ${u.slash_commands.TOTAL})`,
                        value: "```\n" + slist.slice(0, 20).join("\n") + "\n```",
                    }
                ]
            }]
        })
    }
}
//module.exports.options.push({ type: "STRING", required: true, name: 'json', description: "The" })
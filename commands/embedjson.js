const { Message } = require("discord.js");

module.exports = {
    name: "embedjson",
    description: "shows the json of and embed lolololololol",
    usage: "embedjson <id:string>",
    async execute(message, args) {
        var id = args[0];
        var msg = await message.channel.messages.fetch(id);
        var json = JSON.stringify(msg.embeds, null, 4);
        message.channel.send(`There you go:
        \`\`\`json
        ${json}
        \`\`\``);
    }
}
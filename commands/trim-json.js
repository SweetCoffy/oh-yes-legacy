module.exports = {
    name: "trim-json",
    description: "does what the name says",
    usage: "trim-json <json string>",
    
    async execute(message, args) {
        var json = args.join(" ");
        var parsedJson = JSON.parse(json);
        var trimmedJson = JSON.stringify(parsedJson);
        await message.channel.send(`there you go: \`\`\`json\n${trimmedJson}\`\`\``);
        message.delete();
    }
}
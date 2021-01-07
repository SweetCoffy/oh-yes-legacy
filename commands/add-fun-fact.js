const stuff = require("../stuff");

module.exports = {
    name: "add-fun-fact",
    aliases: ['addfunfact', 'addfact', 'add-fact'],
    useArgsObject: true,
    arguments: [
        {
            name: "content",
            type: "string",
            description: "The contents of the fun fact"
        }
    ],
    cooldown: 30,
    execute(message, args) {
        var url = (message.attachments.first() || {}).url || '';
        stuff.addFunFact(message.author.id, args.content, url)
        var embed = {
            color: 0x22ff22,
            title: "oh yes",
            description: "Succesfully added the fun fact"
        }
        message.channel.send({embed: embed})
    }
}
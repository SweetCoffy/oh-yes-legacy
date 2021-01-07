var yt = require('youtube-search-api');
module.exports = {
    name: "youtube",
    useArgsObject: true,
    arguments: [
        { name: "query", type: "string" }
    ],
    aliases: ['yt'],
    async execute(message, args) {
        var msg = await message.channel.send(`🔍 Searching \`${args.query}\``)
        var results = await yt.GetListByKeyword(args.query);
        if (results.items[0]) {
            msg.edit("https://youtube.com/watch/?v=" + results.items[0].id)
        } else {
            msg.edit(`No results found`)
        }
    }
}
var yt = require('youtube-search-api');
var util = require('util')
module.exports = {
    name: "youtube",
    useArgsObject: true,
    arguments: [
        { name: "query", type: "string" }
    ],
    aliases: ['yt'],
    async execute(message, args, _a, extraArgs) {
        var txt = args.query.toLowerCase();
        function checkAmongUs(txt) {
            txt = txt.replace(/\s/, "").toLowerCase();
            return (txt.includes("amog") || txt.includes("among") || txt.includes("amogn") || txt.includes("amg") || txt.includes("amon")) && (txt.includes("us") || txt.includes("u") || txt.includes("s")) || txt.includes("sus") || txt.includes("mogus") || txt.includes("vent") || txt.includes("hentai") || txt.includes("drip") || txt.includes("owo") || txt.includes("uwu");
        }
        if (checkAmongUs(txt)) throw `no`
        var msg = await message.channel.send(`🔍 Searching \`${args.query}\``)
        var results = await yt.GetListByKeyword(args.query);
        if (results.items[0]) {
            var i = 0;
            if (extraArgs.debug) {
                await msg.edit({ content: util.inspect(results.items[i]), code: "js", split: true })
                return;
            }
            var txt = results.items[i].title.toLowerCase();
            if (checkAmongUs(txt)) throw `still no`
            msg.edit("https://youtube.com/watch?v=" + results.items[0].id)
        } else {
            msg.edit(`No results found`)
        }
    }
}
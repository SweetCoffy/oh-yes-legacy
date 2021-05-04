const stuff = require("../stuff")

module.exports = {
    name: "console",
    async execute(message, _args, phoneData, slot, eggContext) {
        await message.channel.send(`EggScript console go brrrrr`)
        var c = message.channel.createMessageCollector((m) => m.author.id == message.author.id, { time: 1000 * 60 * 2 })
        var kill = false;
        c.on('collect', (m) => {
            if ( m.content == "^c") return c.stop()
            try {
                var context = {
                    console: {
                        kill() {
                            c.stop()
                        }
                    }
                };
                var actualContext = {...eggContext, ...context}
                var result = stuff.eggscript(m.content, actualContext)
                message.channel.send({content: require('util').inspect(result), code: "js", split: true})
            } catch(er) { stuff.sendError(message.channel, er) }
        }).on('end', () => {
            message.channel.send(`Console is kil`)
        })
    }
}
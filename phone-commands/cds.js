module.exports = {
    name: "cds",
    computerOnly: true,
    execute(message, args, data, slot) {
        var embed = {
            title: "cds",
            description: data.discs.map(el => ":cd: " + el.name).join("\n"),
            footer: {
                text: `you have ${data.discs.length} discs h`
            }
        }
        message.channel.send({embed: embed})
    }
}
module.exports = {
    name: "snipe",
    execute(message) {
        var msg = message.client.lastDeleted;
        if (!msg) throw `There's nothing to snipe!`
        var embed = {
            author: {
                name: msg.member.displayName,
                iconURL: msg.author.avatarURL()
            },
            description: msg.content,
            color: 0x037bfc,
        }
        if (msg.attachments.first()) {
            var attachment = msg.attachments.first()
            embed.image = { url: attachment.url, spoiler: attachment.spoiler }
        }
        message.channel.send({embed: embed})
    }
}
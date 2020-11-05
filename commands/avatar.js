module.exports = {
    name: "avatar",
    description: "ha ha yes pfp stealer 100",
    usage: "avatar [user]",
    execute(message) {
        var user = message.mentions.users.first() || message.author;
        var embed = {
            title: "ha ha yes",
            image: { url: user.avatarURL() }
        }
        message.channel.send({ embed: embed });
    }
}
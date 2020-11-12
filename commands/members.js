module.exports = {
    name: "members",
    async execute(message) {
        var members = (await message.guild.members.fetch()).map(el => el.displayName)
        message.channel.send(members.join(", "))
    }
}
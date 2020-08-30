module.exports = {
    name: "cri",

    requiredPermission: "commands.cri",

    execute (message, args) {
        message.channel.send(message.author.username + " comitted ;-;");
    }
}
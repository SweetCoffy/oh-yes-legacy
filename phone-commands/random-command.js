module.exports = {
    name: "random-command",
    package: "h",
    execute(message) {
        message.channel.send(`${message.author} get pinged lol`);
    }
}
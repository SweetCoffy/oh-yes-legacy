module.exports = {
    name: "eggs",
    package: "eggs",
    execute(message) {
        message.channel.send("works");
    }
}
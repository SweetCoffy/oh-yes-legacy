module.exports = {
    name: "impostors",

    execute (message) {
        message.channel.send(`there are **${message.client.impostors.length}** impostors left`);
    }
}
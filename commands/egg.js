// egg command

module.exports = {
    name: "egg",

    usage: "egg <user:mention>",

    execute (message, args) {
        const user = message.mentions.users.first();

        if (user) {

            message.channel.send("looks like <@" + user.id + "> wants eggs");

        } else {
            message.channel.send("looks like <@" + message.author.id + "> wants eggs");
        }
    }
}
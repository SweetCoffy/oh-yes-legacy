module.exports = {
    name: "ghostping",

    usage: "ghostping <user:mention>",

    execute (message, args) {
        var user = message.mentions.users.first();

        if (!user) {
            throw "***no***";
        }

        
        message.channel.send(`<@!${user.id}> get pinged lol`).then (m => {
            m.delete();
        })

        message.delete();
    }
}
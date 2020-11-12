module.exports = {
    name: "ghostping",
    arguments: [
        {
            name: "user",
            type: "user"
        }
    ],
    useArgsObject: true,

    execute (message, args) {
        message.channel.send(`${args.user} get pinged lol`).then (m => {
            m.delete();
        })
        message.delete();
    }
}
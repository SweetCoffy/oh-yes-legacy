const stuff = require("../stuff")

module.exports = {
    name: "huntcoop",
    arguments: [
        {
            name: "user",
            type: "user"
        }
    ],
    useArgsObject: true,
    execute(msg, args) {
        if (stuff.fighting[args.user.id]) {
            stuff.fighting[msg.author.id] = stuff.fighting[args.user.id]
            msg.channel.send("Yes.")
        } else throw 'no'
    }
}
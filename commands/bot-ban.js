const stuff = require("../stuff")

module.exports = {
    name: "bot-ban",
    requiredPermission: "commands.bot-ban",
    arguments: [
        {
            name: "user",
            type: "user",
            description: "The user to ban"
        }
    ],
    useArgsObject: true,
    execute(message, args) {
        var banned = stuff.dataStuff.getData(`/banned`)
        if (banned.includes(args.user.id)) {
            var index = banned.indexOf(args.user.id);
            stuff.dataStuff.delete(`/banned[${index}]`)
            message.channel.send(`Sucessfully unbanned ${args.user.username} from using the bot lol`);
            return
        }
        stuff.dataStuff.push(`/banned[]`, args.user.id);
        message.channel.send(`Sucessfully banned ${args.user.username} from using the bot lol`);
    }
}
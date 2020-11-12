const { User } = require('discord.js')
module.exports = {
    name: "avatar",
    description: "ha ha yes pfp stealer 100",
    useArgsObject: true,
    arguments: [
        {
            name: "user",
            type: "user",
            optional: true,
            default: "me",
            description: "The user to steal it's pfp"
        }
    ],
    aliases: ['pfp', 'icon'],
    execute(message, args) {
        /**
         * @type User
         */
        var user = args.user;
        var embed = {
            title: "ha ha yes",
            image: { url: user.displayAvatarURL({dynamic: true, size: 2048, format: 'png'}) }
        }
        message.channel.send({ embed: embed });
    }
}
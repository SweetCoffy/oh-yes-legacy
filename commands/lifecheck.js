module.exports = {
    name: "lifecheck",
    useArgsObject: true,
    arguments: [
        {
            name: "user",
            type: "user",
            description: "The user to lifecheck"
        }
    ],
    cooldown: 60,
    async execute(message, args) {
        var msg = await message.channel.send(`${args.user} Lifecheck`);
        var reactions = await msg.awaitReactions((r, u) => u.id == args.user.id, { time: 30000, max: 5 });
        if (reactions.size > 0) {            
            var embed = {
                title: `${args.user.username} got through Lifecheck`,
                description: `${reactions.map(el => `${el.emoji}`).join(" ")}`,
            }
            message.channel.send({embed: embed})
        } else {
            message.channel.send(`${args.user} Failed the Lifecheck`)
        }
    }
}
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
    async execute(message, args) {
        var msg = await message.channel.send(`${args.user} Lifecheck`);
        console.log('message sent')
        var reactions = await msg.awaitReactions((r, u) => u.id == args.user.id, { time: 5000, max: 5 });
        console.log(reactions)
        if (reactions.size > 0) {            
            var embed = {
                title: `${args.user.username} got through Lifecheck`,
                description: `${reactions.map(el => `${el.emoji}`).join(" ")}`,
            }
            await message.channel.send({embed: embed})
        } else {
            await message.channel.send(`${args.user} Failed the Lifecheck`)
        }
    }
}
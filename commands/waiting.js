module.exports = {
    name: "waiting",
    useArgsObject: true,
    arguments: [
        {
            name: "time",
            type: "time"
        }
    ],
    async execute(message, args) {
        var chars = ["|", "/", "-", "\\"]
        var target = Date.now() + (args.time)
        var msg = await message.channel.send(`Waiting...`)
        var counter = 0;
        var interval = setInterval(() => {
            msg.edit(`Waiting... ${chars[counter]} (${Math.floor((target - Date.now()) / 1000)} seconds left)`)
            counter++;
            if (counter > (chars.length - 1)) counter = 0;
        }, 1000 * 2)
        setTimeout(() => {
            clearInterval(interval);
            msg.delete();
            message.channel.send(`${message.author} Waitingn't`)
        }, args.time)
    }
}
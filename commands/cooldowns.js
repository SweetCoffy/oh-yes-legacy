module.exports = {
    name: "cooldowns",
    async execute(msg) {
        var c = msg.client.cooldowns;
        console.log(c)
        if (!c) throw 'the no'
        function funiTime(time = 0) {
            var ms = time % 1000;
            var s = Math.floor(time / 1000)
            var m = Math.floor(s / 60)
            var h = Math.floor(m / 60)
            m %= 60;
            s %= 60;
            return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().slice(0, 2).padStart(2, "0")}`
        }
        await msg.channel.send({
            embeds: [{
                title: "funni cooldowns",
                description: c.filter((v, k) => v.has(msg.author.id)).map((v, k) => {
                    return `\`${k}\`: ${funiTime(Math.max(((msg.client.commands.get(k).cooldown || 1) * 1000) - (Date.now() - v.get(msg.author.id)), 0) || 0)}`
                }).join("\n") || "no"
            }]
        })
    }
}
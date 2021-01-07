const stuff = require("../stuff")

module.exports = {
    name: "work",
    description: "do work and earn moni!!11!1",
    cooldown: 7.5,
    execute (message) {
        var things = [
            {
                message: "You got free Internet Points\™️ from someone... h",
                amount: 700,
            },
            {
                message: "You told someone to not do the cat",
                amount: 15000,
            },
            {
                message: "You sold your eggs to some questionable company",
                amount: 10000,
            },
            {
                message: "You gave eggs to the Sky Egg Lord and got Internet Points\™ in exchange",
                amount: 1000,
            },
        ]        
        var thing = stuff.randomArrayElement(things);
        var embed = {
            title: "stonks",
            color: 0x40ff60,
            description: thing.message,
        }
        var amount = thing.amount * Math.random();
        if (amount > 0) {
            amount *= stuff.clamp(stuff.getMultiplier(message.author.id, false) * Math.random(), 1, Infinity)
            embed.thumbnail = { width: 1024, height: 512, url: 'https://cdn.discordapp.com/attachments/758128084632600599/777283874907750400/2Q.png' }
        }
        if (amount == 0) {
            amount *= 0;
            embed.title = "confused stonks"
            embed.color = 0xffff00,
            embed.footer.text = `you didn't earn or lose moni`
            embed.thumbnail = { width: 1024, height: 512, url: 'https://i.redd.it/5fm9ifqkgzr31.jpg' }
        }
        if (amount < 0) {
            embed.title = "not stonks"
            embed.color = 0xff4040;
            embed.footer.text = `lost ${stuff.format(-amount)} Internet Points\™️`
            embed.thumbnail = { width: 1024, height: 512, url: 'https://cdn.thednvr.com/uploads/2020/08/31081641/video_image-AD6vS07lL-1.jpg' }
        }         
        embed.footer = { text: `earned ${stuff.format(amount)} Internet Points\™️` }
        stuff.addPoints(message.author.id, amount, `Did work`);
        message.channel.send({embed: embed});
    }
}
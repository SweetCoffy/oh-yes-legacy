const stuff = require("../stuff")

module.exports = {
    name: "work",
    description: "do work and earn moni!!11!1",
    cooldown: 7.5,
    category: "economy",
    execute (message, a, _e, e) {
        var things = [
            {
                message: "You got free Internet Points\™️ from someone... h",
                amount: 70,
            },
            {
                message: "You told someone to not do the cat",
                amount: 1500,
            },
            {
                message: "You sold your eggs to some questionable company",
                amount: 1000,
            },
            {
                message: "You gave eggs to the Sky Egg Lord and got Internet Points\™ in exchange",
                amount: 100,
            },
            {
                message: "You deleted some random person that did the cat from existence",
                amount: 3000,
            },
            {
                message: "You did the cat",
                amount: -1,
                onGet: (user, msg) => {
                    stuff.startBattle(user.id, stuff.enemies['the-cat'])
                    msg.channel.send("The Cat has awoken!")
                }
            }
        ]        
        var thing = stuff.randomArrayElement(things);
        if (e.debug) thing = things[e.debug]
        var embed = {
            title: "stonks",
            color: 0x40ff60,
            description: thing.message,
            footer: {}
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
        if (thing.onGet) thing.onGet(message.author, message)
        stuff.addPoints(message.author.id, amount, `Did work`);
        message.channel.send({embed: embed});
    }
}
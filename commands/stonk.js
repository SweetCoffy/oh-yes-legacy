var stuff = require('../stuff')
module.exports = {
    name: "stonk",
    description: `Ha ha yes stonk market`,
    execute(message) {
        var i = stuff.shopItems;
        var h = Object.entries(stuff.stonks).sort((a, b) => b[1].percent - a[1].percent);
        var embed = {
            title: "stonk market lol",
            description: `${h.map(el => `${i[el[0]].icon} **${i[el[0]].name}** — ${stuff.format(i[el[0]].price * el[1].mult)}, ${(el[1].percent * 100).toFixed(1)}%`).slice(0, 15).join(`\n`) || 'empty lol'}`
        }
        message.channel.send({embed: embed})
    }
}
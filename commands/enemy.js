var stuff = require('../stuff')
module.exports = {
    name: "enemy",
    useArgsObject: true,
    arguments: [
        {
            type: "string",
            name: "enemy",
            optional: true,
            default: "all"
        }
    ],
    execute(msg, args) {
        if (args.enemy == "all" || !args.enemy) {
            msg.channel.send({embed: {
                title: `Enemy list`,
                description: `${Object.keys(stuff.enemies).map(el => `${stuff.enemies[el].icon || ""} \`${el}\` ${stuff.enemies[el].name}`).join("\n")}`
            }})
        } else {
            var e = stuff.enemies[args.enemy]
            if (!e) {
                var g = Object.keys(stuff.enemies).find(el => stuff.enemies[el].name.toLowerCase().startsWith(args.enemy.toLowerCase()) || el.toLowerCase().startsWith(args.enemy.toLowerCase()))
                e = stuff.enemies[g]
            }
            var rarityRanges = {
                get(num) {
                    var r = this.ranges;
                    var e = r[0]
                    for (var range of r) {
                        if (num >= range.num) e = range;
                    }
                    return e;
                },
                ranges: [
                    { num: 0, label: "Common", color: stuff.rarity.white },
                    { num: 7, label: "Uncommon", color: stuff.rarity.green },
                    { num: 15, label: "Rare", color: stuff.rarity.blue },
                    { num: 20, label: "E🅱️ic", color: stuff.rarity.red },
                    { num: 24, label: "Really fucking rare", color: stuff.rarity.purple },
                    { num: 999, label: "Boss", color: stuff.rarity.yellow },
                    { num: 9999, label: "Easter Egg", color: stuff.rarity.yellow },
                ]
            }
            var r = rarityRanges.get(e.rarity || 0)
            if (!e) throw `me when invalid enemy`
            msg.channel.send({embed: {
                title: `${e.name}`,
                color: r.color,
                description: 
`
ID: \`${e.id}\`

${e.description || "N/A"}

Randomly spawns: ${e.hidden ? "No" : "Yes"}
Minimum spawn power level: ${stuff.format(e.minLevel)}

Base IP reward (100% difficulty): ${stuff.format(e.moneyDrop)}
Base XP reward (200% difficulty): ${stuff.format(e.xpReward)}

❤️ ${stuff.format(e.minHealth)} - ${stuff.format(e.maxHealth)}
🗡️ ${stuff.format(e.minAttack)} - ${stuff.format(e.maxAttack)}
🛡️ ${stuff.format(e.minDefense)} - ${stuff.format(e.maxDefense)}

Rarity: ${r.label} (+${e.rarity || 0})

Drops:
${(e.drops || []).map(el => `${(el.chance * 100).toFixed(1)}% Chance, ${el.min}x - ${el.max}x ${stuff.itemP(el.item, 1)}`).join("\n") || "none"}
`
            }})
        }
    }
}
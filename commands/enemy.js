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
            if (!e) throw `me when invalid enemy`
            msg.channel.send({embed: {
                title: `${e.name}`,
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

Drops:
${(e.drops || []).map(el => `${(el.chance * 100).toFixed(1)}% Chance, ${el.min}x - ${el.max}x ${stuff.itemP(el.item, 1)}`).join("\n") || "none"}
`
            }})
        }
    }
}
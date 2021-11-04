var stuff = require('../stuff')
var { Message, MessageButton, MessageActionRow } = require('discord.js')

module.exports = {
    name: "minigam",
    description: "Soon™️",
    /**
     * 
     * @param {Message} msg 
     */
    async execute(msg) {
        var tools = [
            {
                icon: "⛏️",
                name: "picc",
                power: 1.5,
                cooldown: 1,
                cooldownLeft: 0,
            },
            {
                icon: "🔨",
                name: "bonc",
                power: 2.1,
                cooldown: 2,
                cooldownLeft: 0,
            },
            {
                icon: "💣",
                name: "bomb",
                power: 3.7,
                cooldown: 16,
                cooldownLeft: 0,
            }
        ]
        var curtool = 0;
        var tiles = [];
        for (var i = 0; i < 5 * 4; i ++) {
            var item = "rock"
            var amt = 50;
            if (Math.random() < 0.5) {
                item = "copper"
                amt = 30;
            }
            if (Math.random() < 0.2) {
                item = "titanium"
                amt = 25;
            }
            if (Math.random() < 0.1) {
                item = "v_"
                amt = 75
            }
            tiles.push({
                health: 1 + Math.floor(Math.random() * 4),
                item: item
            })
        }
        var healthIcons = [
            "🟫",
            "🟩",
            "⬛",
        ]
        var m = await msg.reply({
            content: "brug",
        })

        var startFuni = Math.round(Math.random() * 20)
        var startHp = tiles.reduce((prev, cur) => prev + cur.health, 0)
        var moves = Math.floor(startHp * 0.39)
        var score = 0
        var start = Date.now()
        async function update() {
            var rows = []
            for (var y = 0; y < 4; y++) {
                var buttons = []
                for (var x = 0; x < 5; x++) {
                    var t = tiles[x + (y * 5)]
                    buttons.push(new MessageButton({
                        style: "SECONDARY",
                        customId: (x + (y * 5)) + "",
                        emoji: (t.health <= 0) ? stuff.shopItems[t.item].icon : healthIcons[Math.max(Math.min(Math.round(t.health) - 1, healthIcons.length - 1), 0)] }))
                }
                rows.push(new MessageActionRow({ components: buttons }))
            }
            m = await m.edit({
                content: "```" + 
                `Score: ${score.toString().padStart(9, "0")}\nProgress: ${(100 - (tiles.reduce((prev, cur) => prev + cur.health, 0) / startHp * 100)).toFixed(1)}%\nMoves: ${moves}\nTools:\n${tools.map(el => `${el.icon} ${el.name} ${(el.cooldownLeft > 0) ? "⏱️ " : ""}${"█".repeat(Math.max(el.cooldownLeft, 0))}`).join("\n")}\n`
                + "```",
                components: [
                    ...rows,
                    new MessageActionRow({
                        components: tools.map((el, i) => {
                            return new MessageButton({
                                customId: `tool:${i}`,
                                label: el.name,
                                emoji: el.icon,
                                style: (i == curtool) ? "SUCCESS" : "PRIMARY",
                                disabled: i == curtool,
                            })
                        })
                    })
                ]
            })
            var i = await m.awaitMessageComponent({ filter: (i) => {
                if (i.user.id != msg.author.id) {
                    i.reply({ ephemeral: true, content: "This isn't for you, you fucking egger" })
                    return false;
                }
                return true;
            } })
            if (i.customId.startsWith("tool:")) {
                curtool = parseInt(i.customId.slice("tool:".length))
                i.deferUpdate()
                await update()
            } else {
                if (tools[curtool].cooldownLeft > 0) {
                    i.reply({
                        ephemeral: true,
                        content: "Your current tool is on cooldown",
                    })
                    return await update()
                }
                i.deferUpdate()
                var p = tools[curtool].power;
                var dist = 0;
                var x = parseInt(i.customId) % 5;
                var y = Math.floor(parseInt(i.customId) / 5)
                var checks = [
                    [1, 0],
                    [-1, 0],
                    [0, 1],
                    [0, -1],
                    [1, 1],
                    [1, -1],
                    [-1, 1],
                    [-1, -1],
                ]
                if (tiles[x + (y * 5)].health > 0) {
                    score += p * 100
                }
                tiles[x + (y * 5)].health -= p;
                tools[curtool].cooldownLeft = tools[curtool].cooldown
                p--;
                var div = 1
                while (p > 0) {
                    for (var c of checks) {
                        var x_ = stuff.clamp((x + (c[0] * dist)), 0, 4);
                        var y_ = stuff.clamp(y + (c[1] * dist), 0, 3);
                        console.log(`${x_}, ${y_}`)
                        if (tiles[x_ + ((y_) * 5)].health > 0) {
                            score += Math.floor(p * 100)
                            if (!tiles[x_ + ((y_) * 5)].ded) {
                                tiles[x_ + ((y_) * 5)].ded = true;
                                score += 200;
                            }
                        }
                        tiles[x_ + ((y_) * 5)].health -= p;
                    }
                    dist++;
                    div *= checks.length / 2;
                    p--;
                }
                for (var t of tiles) {
                    t.health = stuff.clamp(t.health, 0, Infinity)
                }
                moves--;
                for (var t of tools) {
                    if (t.cooldownLeft > 0) t.cooldownLeft--;
                }
                if (tiles.every(el => el.health <= 0) || moves <= 0) {
                    m.delete();
                    var destroy = tiles.reduce((prev, cur) => prev + cur.health, 0)

                    var bonuses = []
                    bonuses.push({
                        name: "Score",
                        amt: score
                    })

                    bonuses.push({
                        name: "Destroy'd Bonus",
                        amt: Math.ceil(startHp - destroy) * 100
                    })
                    if (destroy <= 0) {
                        bonuses.push({
                            name: "Perfect Bonus",
                            amt: 25000
                        })
                    }
                    var total = bonuses.reduce((prev, cur) => prev + cur.amt, 0)
                    
                    await msg.reply({
                        content: "```" 
                        + `Epic win\n\n${[...bonuses].map(el => `${el.name.padEnd(32, " ")} ${el.amt.toString().padStart(9, " ")}`).join("\n")}\n\n${"Total".padEnd(32, " ")} ${total.toString().padStart(9, " ")}` 
                        + "```"
                    })
                    return
                }
                await update()
            }
        }
        await update()
    }
}
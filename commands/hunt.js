var stuff = require('../stuff')
module.exports = {
    name: "hunt",
    description: `shadowdude's hunt command, but better`,
    category: "economy",
    cooldown: 1,
    async execute(message, _h, _hh, { debug }) {
        if (stuff.userHealth[message.author.id] <= 0) return message.channel.send(`You are dead, stop it`)
            var _e = Object.values(stuff.enemies).filter(e => !e.hidden && ((stuff.getMaxHealth(message.author.id) + stuff.getAttack(message.author.id) + stuff.getDefense(message.author.id)) >= (e.minLevel || -1000000)))
            if (debug && message.author.id == "602651056320675840") {
                _e = stuff.enemies[debug]
            } else {
                _e = _e[Math.floor(_e.length * Math.random())]
            }
            var e = {
                name: _e.name,
                id: _e.id,
                type: _e,
                maxHealth: _e.minHealth + Math.random() * (_e.maxHealth - _e.minHealth),
                attack: _e.minAttack + Math.random() * (_e.maxAttack - _e.minAttack),
                defense: _e.minDefense + Math.random() * (_e.maxDefense - _e.minDefense),
                health: 0,
                moneyDrop: _e.moneyDrop,
            }
            e.health = e.maxHealth;
            if (stuff.fighting[message.author.id] && stuff.fighting[message.author.id].health > 0) e = stuff.fighting[message.author.id]
            else stuff.fighting[message.author.id] = e;
            var _m = stuff.clamp(((e.maxHealth / e.type.maxHealth) + (e.attack / e.type.maxAttack) + (e.defense / e.type.maxDefense)) / 1.5, 0, 69);
            console.log(m)
            var logs = []
            var embed = {
                title: `${message.author.username} vs ${e.name}`,
                description: `Difficulty: ${(_m * 100).toFixed(1)}%\n${message.author.username}: ${stuff.betterFormat(stuff.userHealth[message.author.id], stuff.formatOptions.number)}\n${e.name}: ${stuff.betterFormat(e.health, stuff.formatOptions.number)}`
            }
            var m = await message.channel.send({embed: embed})
            await m.react('🗡️')
            await m.react('868635955370786858')
            function repeat(char, times) {
                var str = ""
                for (var i = 0; i < times; i++) {
                    str += char;
                }
                return str
            }
            function getBar(amt, max, w = 10, align = "left") {
                var bg = "⬛"
                var gr = "🟩"
                var yl = "🟨"
                var rd = "🟥"
                var fl = rd
                var p = amt / max
                if (p > 0.25) fl = yl
                if (p > 0.5) fl = gr
                var a = stuff.clamp(Math.floor(p * w), 0, w)
                return `${repeat(fl, a) + repeat(bg, w - a)}`
            }
            var updateEmbed = async() => {
                console.log(logs)
                embed.description = 
`\`\`\`
Difficulty: ${(_m * 100).toFixed(1)}%
${message.author.username.padEnd(32, " ")} ${getBar(stuff.userHealth[message.author.id], stuff.getMaxHealth(message.author.id))} 
❤️ ${stuff.betterFormat(stuff.userHealth[message.author.id], stuff.formatOptions.number)}/${stuff.format(stuff.getMaxHealth(message.author.id))}
🗡️ ${stuff.format(stuff.getAttack(message.author.id))}
🛡️ ${stuff.format(stuff.getDefense(message.author.id))}

${e.name.padEnd(32, " ")} ${getBar(e.health, e.maxHealth)} 
❤️ ${stuff.betterFormat(e.health, stuff.formatOptions.number)}/${stuff.format(e.maxHealth)}
🗡️ ${stuff.format(e.attack)}
🛡️ ${stuff.format(e.defense)}
\`\`\``
                embed.fields = [
                    {
                        name: "Logs",
                        value: "```\n" + (logs.slice(0, 5).reverse().join("\n") || "empty, just like ur mom before i arriv-") + "\n```"
                    }
                ]
                await m.edit({embed: embed})
            }
            await updateEmbed();
            var c = m.createReactionCollector((r, u) => ['🗡️', 'immaheadout'].includes(r.emoji.name) && u.id == message.author.id, { time: 1000 * 120 })
            c.on('collect', (r, u) => {
                r.users.remove(u.id)
                if (r.emoji.name == '🗡️') {
                    var crit = Math.random() < 0.1;
                    var pDmg = stuff.getAttack(u.id) + (stuff.getAttack(u.id) * 2.5 * Math.random())
                    if (crit) pDmg *= 2
                    pDmg = stuff.clamp(pDmg - e.defense, 0, Infinity)
                    e.health -= pDmg
                    logs.unshift(`${u.username} attacked and dealt ${stuff.betterFormat(pDmg, stuff.formatOptions.number)} damage`)
                    if (crit) logs.unshift(`It was a critical hit!!1!!11!1!1`)
                    if (e.health <= 0) {
                        logs.unshift(`${e.name} Died`)
                        message.channel.send(`${e.name} has been defeated, got <:ip:770418561193607169> ${stuff.betterFormat(e.moneyDrop * _m * stuff.getMultiplier(u.id, false), stuff.formatOptions.number)}`)
                        stuff.addPoints(u.id, e.moneyDrop * _m * stuff.getMultiplier(u.id, false))
                        stuff.fighting[message.author.id] = undefined;
                        c.stop()
                        updateEmbed()
                        return
                    }
                    crit = Math.random() < 0.1;
                    var eDmg = e.attack + (e.attack * 1.8 * Math.random())
                    eDmg = stuff.clamp(eDmg - stuff.getDefense(u.id), 0, Infinity)
                    if (crit) eDmg *= 2
                    logs.unshift(`${e.name} attacked and dealt ${stuff.betterFormat(eDmg, stuff.formatOptions.number)} damage`)
                    if (crit) logs.unshift(`It was a critical hit!!1!!11!1!1`)
                    stuff.userHealth[u.id] -= eDmg
                    if (stuff.userHealth[u.id] <= 0) {
                        logs.unshift(`${u.username} Died`)
                        var lost = Math.floor((e.moneyDrop * _m) / 1000);
                        stuff.addMoney(message.author.id, -lost)
                        logs.unshift(`${u.username} Just lost ${stuff.format(lost)} Internet Points, what a loser lol`)
                        message.reply(`You died`)
                        stuff.fighting[message.author.id] = undefined;
                        c.stop()
                        updateEmbed()
                        return
                    }
                    updateEmbed()
                } else if (r.emoji.name == "immaheadout") {
                    logs.unshift(`${u.username} Fled`)
                    updateEmbed();
                    stuff.fighting[message.author.id] = undefined
                }
            }).on('end', async () => {
                stuff.fighting[message.author.id] = undefined
                m.reactions.removeAll()
            })
        
    }
}
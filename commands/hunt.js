var stuff = require('../stuff')
module.exports = {
    name: "hunt",
    description: `shadowdude's hunt command, but better`,
    cooldown: 10,
    async execute(message) {
        if (stuff.userHealth[message.author.id] <= 0) return message.channel.send(`You are dead, stop it`)
            var _e = Object.values(stuff.enemies).filter(e => !e.hidden && ((stuff.getMaxHealth(message.author.id) + stuff.getAttack(message.author.id) + stuff.getDefense(message.author.id)) >= (e.minLevel || -1000000)))
            _e = _e[Math.floor(_e.length * Math.random())]
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
            var updateEmbed = () => {
                console.log(logs)
                embed.description = `Difficulty: ${(_m * 100).toFixed(1)}%\n${message.author.username}: ${stuff.betterFormat(stuff.userHealth[message.author.id], stuff.formatOptions.number)}\n${e.name}: ${stuff.betterFormat(e.health, stuff.formatOptions.number)}`
                m.edit({embed: embed})
            }
            var c = m.createReactionCollector((r, u) => ['🗡️'].includes(r.emoji.name) && u.id == message.author.id, { time: 1000 * 120 })
            c.on('collect', (r, u) => {
                r.users.remove(u.id)
                if (r.emoji.name == '🗡️') {
                    var crit = Math.random() < 0.1;
                    var pDmg = stuff.getAttack(u.id) + (stuff.getAttack(u.id) * 2.5 * Math.random())
                    if (crit) pDmg *= 2
                    pDmg = stuff.clamp(pDmg - e.defense, 1, Infinity)
                    e.health -= pDmg
                    logs.unshift(`${u.username} attacked and dealt ${stuff.betterFormat(pDmg, stuff.formatOptions.number)} damage`)
                    if (crit) logs.unshift(`It was a critical hit!!1!!11!1!1`)
                    if (e.health <= 0) {
                        message.channel.send(`${e.name} has been defeated, got <:ip:770418561193607169> ${stuff.betterFormat(e.moneyDrop * _m * stuff.getMultiplier(u.id, false), stuff.formatOptions.number)}`)
                        stuff.addPoints(u.id, e.moneyDrop * _m * stuff.getMultiplier(u.id, false))
                        stuff.fighting[message.author.id] = undefined;
                        c.stop()
                        updateEmbed()
                        return
                    }
                    crit = Math.random() < 0.1;
                    var eDmg = e.attack + (e.attack * 1.8 * Math.random())
                    eDmg = stuff.clamp(eDmg - stuff.getDefense(u.id), 1, Infinity)
                    if (crit) eDmg *= 2
                    logs.unshift(`${e.name} attacked and dealt ${stuff.betterFormat(eDmg, stuff.formatOptions.number)} damage`)
                    if (crit) logs.unshift(`It was a critical hit!!1!!11!1!1`)
                    stuff.userHealth[u.id] -= eDmg
                    if (stuff.userHealth[u.id] <= 0) {
                        logs.unshift(`${u.username} Died`)
                        message.reply(`You died`)
                        stuff.fighting[message.author.id] = undefined;
                        c.stop()
                        updateEmbed()
                        return
                    }
                    updateEmbed()
                }
            }).on('end', async () => {
                stuff.fighting[message.author.id] = undefined
                m.reactions.removeAll()
            })
        
    }
}
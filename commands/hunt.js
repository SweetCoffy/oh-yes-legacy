var stuff = require('../stuff')
var { Message, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const Jimp = require('jimp');
module.exports = {
    name: "hunt",
    description: `hunt moment`,
    category: "economy",
    cooldown: 1,
    /**
     * 
     * @param { Message } message 
     * @param {*} _h 
     * @param {*} _hh 
     * @param {*} param3 
     * @returns 
     */
    async execute(message, _h, _hh, { debug }) {
        if (stuff.fighting[message.author.id] && stuff.fighting[message.author.id].message) return
        if (stuff.fighting[message.author.id] && !stuff.fighting[message.author.id].message) stuff.fighting[message.author.id].message = message;
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
                xpReward: _e.xpReward,
            }
            e.prevhp = e.health = e.maxHealth;
            var pprevhp = stuff.userHealth[message.author.id]
            if (stuff.fighting[message.author.id] && stuff.fighting[message.author.id].health > 0) e = stuff.fighting[message.author.id]
            else stuff.fighting[message.author.id] = e;
            var _m = stuff.clamp(((e.maxHealth / e.type.maxHealth) + (e.attack / e.type.maxAttack) + (e.defense / e.type.maxDefense)) / 1.5, 0, 69);
            console.log(m)
            var logs = []
            var embed = {
                title: `${message.author.username} vs ${e.name}`,
                description: `Doing ur mom...`
            }
            var m = await message.channel.send({embed: embed})
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
            var updateEmbed = async(h = true) => {
                console.log(logs)
                embed.image = { url: "attachment://hunt.png" }
/*
                embed.description = 
`\`\`\`
${message.author.username.padEnd(32, " ")} Power Lv. ${stuff.format(stuff.getMaxHealth(message.author.id) + stuff.getAttack(message.author.id) + stuff.getDefense(message.author.id))}
[${stuff.bar(stuff.userHealth[message.author.id], stuff.getMaxHealth(message.author.id), 40)}] ${stuff.betterFormat(stuff.userHealth[message.author.id], stuff.formatOptions.number)}/${stuff.format(stuff.getMaxHealth(message.author.id))}

${e.name.padEnd(32, " ")} Power Lv. ${stuff.format(e.attack + e.defense + e.maxHealth)}
[${stuff.bar(e.health, e.maxHealth, 40)}] ${((e.health / e.maxHealth) * 100).toFixed(1)}%
\`\`\``*/
                delete embed.description
                embed.fields = [
                    {
                        name: "Logs",
                        value: "```\n" + (logs.slice(0, 5).reverse().join("\n") || "empty, just like ur mom before i arriv-") + "\n```"
                    }
                ]
                var j = await stuff.funi([{ prevhp: pprevhp, name: message.author.username, hp: stuff.userHealth[message.author.id], maxhp: stuff.getMaxHealth(message.author.id) },
                { hp: e.health, maxhp: e.maxHealth, name: e.name, prevhp: e.prevhp }])
                await j.resize(1024, Jimp.AUTO, Jimp.RESIZE_NEAREST_NEIGHBOR)
                await m.delete()
                console.log(embed)
                m = await m.channel.send({embeds: [embed], files: [new MessageAttachment(await j.getBufferAsync(Jimp.MIME_PNG), "hunt.png")], components: [new MessageActionRow({ components: [
                    new MessageButton({type: "BUTTON", style: "PRIMARY", label: "Attack", customId: "attack", emoji: "🗡️"}),
                    new MessageButton({type: "BUTTON", style: "SECONDARY", label: "Run", customId: 'run', emoji: "868635955370786858"})
                ] })]})
                if (!h) {
                    console.log("funni end")
                    return
                }
                e.prevhp = e.health
                pprevhp = stuff.userHealth[message.author.id]
                var u = message.author
                try {
                    var c = await m.awaitMessageComponent({ time: 60000, componentType: "BUTTON", filter: (i) => i.user.id == message.author.id })
                    await c.deferUpdate()
                    console.log(c)
                    if (c.customId == "attack") {
                        console.log("atac")
                        var crit = Math.random() < 0.1;
                        var pDmg = (stuff.getAttack(u.id) * 2) + (stuff.getAttack(u.id) * 0.5 * Math.random())
                        pDmg = stuff.clamp((pDmg / (1)) - e.defense, e.type.minDamage ?? 1, Infinity)
                        if (crit) pDmg *= 2
                        e.health -= pDmg
                        logs.unshift(`${u.username} attacked and dealt ${stuff.betterFormat(pDmg, stuff.formatOptions.number)} damage`)
                        if (crit) logs.unshift(`It was a critical hit!!1!!11!1!1`)
                        if (e.health <= 0) {
                            logs.unshift(`${e.name} Died`)
                            console.log(`${_m}, ${_m / 2}, ${e.xpReward}`)
                            var xp = Math.floor(e.xpReward * (_m / 2))
                            var r = e.type.drops
                            var items = []
                            if (r) {
                                for (var itm of r) {
                                    if (Math.random() > itm.chance) continue;
                                    var amt = Math.round(stuff.randomRange(itm.min, itm.max))
                                    if (amt <= 0) continue;
                                    items.push({ id: itm.item, amount: amt })
                                    for (var i = 0; i < amt; i++) {
                                        stuff.addItem(message.author.id, itm.item)
                                    }
                                }
                            }
                            message.channel.send(`${e.name} has been defeated, got <:ip:770418561193607169> ${stuff.betterFormat(e.moneyDrop * _m * stuff.getMultiplier(u.id, false), stuff.formatOptions.number)}, ${stuff.format(xp)} XP and the following items:\n${items.map(el => stuff.itemP(el.id, el.amount)).join("\n") || "nothing"}`)
                            stuff.addXP(message.author.id, xp, message.channel)
                            stuff.addPoints(u.id, e.moneyDrop * _m * stuff.getMultiplier(u.id, false))
                            stuff.fighting[message.author.id] = undefined;
                            if (e.type.onKill) {
                                e.type.onKill(message, message.author)
                            }
                            await updateEmbed(false)
                            return
                        }
                        crit = Math.random() < 0.1;
                        var eDmg = (e.attack * 2) + (e.attack * 0.5 * Math.random())
                        eDmg = stuff.clamp((eDmg / (1)) - stuff.getDefense(u.id), 1, Infinity)
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
                            await updateEmbed(false)
                            return
                        }
                        await updateEmbed()
                        return
                    } else if (c.customId == "run") {
                        if (e.type.noEscape) {
                            log.unshift("You cannot escape!")
                            await updateEmbed(true)
                            return
                        }
                        console.log("run")
                        logs.unshift(`${u.username} Ran away`)
                        await updateEmbed(false);
                        stuff.fighting[message.author.id] = undefined
                        return
                    }
                } catch (er) {
                    console.log(er)
                    stuff.fighting[message.author.id] = null;
                }
            }
            await updateEmbed();
    }
}
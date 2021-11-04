const { Message, MessageAttachment, MessageButton, MessageActionRow, MessageComponentInteraction, Client } = require('discord.js');
const Jimp = require('jimp');
var stuff = require('../stuff')
if (!stuff.pvp) stuff.pvp = {}
function takeDamage(p, user, amt, ignoreDefense, mul = 1) {
    if (isNaN(mul)) mul = 1;
    if (isNaN(stuff.userHealth[user.id])) stuff.userHealth[user.id] = stuff.getMaxHealth(user.id)
    var def = p.stats[user.id].def
    if (ignoreDefense) def = 0;
    var dmg = Math.max((amt) - def, 1) * mul
    stuff.userHealth[user.id] -= dmg;
    return dmg;
}
function calcMoveDamage(power, level, atk, def) {
    return Math.ceil(((atk / def) * (power / 15)) * (level / 3))
}
function takeDamagePower(p, user, target, power, mul) {
    var dmg = calcMoveDamage(power, p.stats[user.id].level, p.stats[user.id].atk, p.stats[target.id].def)
    return takeDamage(p, target, dmg, true, mul)
}
const MAX_LOG_LINES = 15
stuff.pvpStatus = {
    poison: {
        name: "Poisoned",
        short: "PSN",
        icon: "🟪",
        turns: 7,
        color: [0x80, 0x00, 0x80, 0xff],
        onGive(b, u) { b.logs.send(`${u.username} has been poisoned!`) },
        onTurn(b, u) { 
            var a = Math.ceil(b.stats[u.id].health * 0.03)
            takeDamage(b, u, a, true)
            b.logs.send(`${u.username} takes ${a} damage from poison!`)
        },
        onTake(b, u) { b.logs.send(`${u.username} is no longer poisoned!`) },
    },
    cringe: {
        name: "Cronge",
        short: "CRONG",
        turns: 8,
        color: [0x61, 0x80, 0x39, 0xff],
        icon: "⬜",
        onGive(b, u) { b.logs.send(`${u.username} cronged!`); b.stats[u.id].defmul -= 0.5; b.stats[u.id].atkmul -= 0.5 },
        onTurn(b, u) { 
            var a = Math.ceil(b.stats[u.id].health * (b.turn * 0.002))
            takeDamage(b, u, a, true)
            b.logs.send(`${u.username} takes ${a} damage from the cronge!`)
        },
        onTake(b, u) { b.logs.send(`${u.username} is no longer cronged!`); b.stats[u.id].defmul += 0.5; b.stats[u.id].atkmul += 0.5 },
    },
    frozen: {
        name: "Frozen",
        short: "FRZ",
        turns: 5,
        color: [0x00, 0x80, 0xff, 0xff],
        onGive(b, u) { b.logs.send(`${u.username} froze!`); b.stats[u.id].defmul += 10 },
        onTurn(b, u) { },
        onTake(b, u) { b.logs.send(`${u.username} is no longer frozen!`); b.stats[u.id].defmul -= 10 },
    },
    loser: {
        name: "Loser",
        short: "LOSER",
        color: [0xff, 0x00, 0x00, 0xff],
        turns: 69,
        onGive(b, u) { b.logs.send(`${u.username}, Where are you from, losertown? Because you're a loser`) },
        onTurn(b, u) { 
            b.stats[u.id].defmul = 0;
            b.stats[u.id].spdmul = 0;
            b.stats[u.id].atkmul = 0;
        },
        onTake(b, u) { b.logs.send(`${u.username} is no longer a loser!`) },
    }
}
stuff.pvpMoves = {
    ping: {
        name: "Ping Attack",
        power: 150,
        accuracy: 50,
        evadable: false,
        description: `A comically powerful ping attack,`,
        type: "attack",
        async beforeUse(logs, c, user, target, b) {
            for (var i = 0; i < 4; i++) {
                logs.send(`@${target.tag}`)
            }
        }
    },
    repeat: {
        name: "Repeat",
        power: 0.1,
        accuracy: 450,
        description: "Comically weak move that can hit a maximum of 5 times",
        type: "attack",
        evadable: true,
    },
    bonk: {
        name: "Bonk",
        power: 40,
        accuracy: 100,
        type: "attack",
        description: "A bonk",
        evadable: true,
    },
    fast: {
        name: "Fast",
        power: 10,
        accuracy: 95,
        type: "attack",
        description: "fast",
        speedMul: 1,
        evadable: false,
        onUse(logs, c, user, target, p) {
            if (p.stats[user.id].evasion >= 0.25) return;
            p.stats[user.id].evasion += 0.05
        }
    },
    twitter: {
        name: "Twitter",
        power: NaN,
        accuracy: 95,
        evadable: true,
        description: "Makes the target cronge due to twitter, has a chance to poison aswell",
        use(logs, c, user, target, p) {
            addStatus(p, target, "cringe")
            if (Math.random() < 0.3) addStatus(p, target, "poison")
            if (Math.random() < 0.01) addStatus(p, target, "loser")
            if (Math.random() < 0.03) addStatus(p, target, "frozen")
        }
    },
    stronk: {
        name: "Stronk",
        power: NaN,
        accuracy: 100,
        description: "Increases the user's attack",
        use(logs, c, user, target, p) {
            p.stats[user.id].atkmul *= 1.5;
            logs.send(`${user.username}'s Attack rose!'`)
        }
    },
    tonk: {
        name: "Tonk",
        power: NaN,
        accuracy: 100,
        description: "Increases the user's defense",
        use(logs, c, user, target, p) {
            p.stats[user.id].defmul *= 1.5;
            logs.send(`${user.username}'s Defense rose!'`)
        }
    },
    hel: {
        name: "Hel",
        power: NaN,
        accuracy: 100,
        usesCharge: true,
        description: "Heals the user, the effect depends on how many charges the user has",
        use(logs, c, user, target, p) {
            var c = Math.min(p.stats[user.id].charge, 7)
            if (c >= 1) {
                logs.send(`${user.username} Healed their status effects!`)
                if (p.status[user.id]) {
                    var e = [...p.status[user.id]]
                    for (var s of e) {
                        removeStatus(p, user, s.id)
                    }
                }
            } 
            if (c >= 2) {
                var hp = Math.min(p.stats[user.id].health - stuff.userHealth[user.id], (c - 1) * (p.stats[user.id].health / 6))
                stuff.userHealth[user.id] += hp
                logs.send(`${user.username} Restored ${hp} HP!`)
            }
            if (c >= 4) {
                var h = (c - 3) * 25;
                p.stats[user.id].health += h;
                stuff.userHealth[user.id] += h;
                logs.send(`${user.username} got +${h} Max HP!`)
            }
            p.stats[user.id].charge -= c;
        }
    },
    counter: {
        name: "Counter",
        power: NaN,
        accuracy: 100,
        description: "Deals double the damage taken. This move ignores the target's defense and is always done last",
        speedMul: -999,
        failCheck(user, t, p) {
            var dmg = (p.stats[user.id].prevhp || p.stats[user.id].health) - stuff.userHealth[user.id];
            console.log(p.stats[user.id].prevhp)
            console.log(dmg)
            if (dmg < 0) {
                return false;
            }
            return true;
        },
        use(logs, c, user, target, p) {
            var dmg = (p.stats[user.id].prevhp || p.stats[user.id].health) - stuff.userHealth[user.id];
            console.log(dmg)
            var d = takeDamage(p, target, Math.ceil(dmg || 0) * 2, true)
            logs.send(`${target.username} took ${Math.floor(d)} damage`)
        }
    },
    charge: {
        name: "Charge",
        power: NaN,
        accuracy: 100,
        usesCharge: true,
        description: "Charges funi attacc",
        failCheck(user, t, p) {
            return p.stats[user.id].charge < 100;
        },
        use(logs, c, user, target, p) {
            p.stats[user.id].charge++;
            logs.send(`${user.username} is charging...`)
        },
    },
    release: {
        name: "Release",
        power: NaN,
        accuracy: 100,
        usesCharge: true,
        type: "attack",
        getPower(user, t, p) {
            return p.stats[user.id].charge * 50;
        },
        beforeUse(logs, c, user, target, p) {
            logs.send(`${user.username} released their charge! (${p.stats[user.id].charge * 50} Power)`)
        },
        afterUse(logs, c, user, target, p) {
            p.stats[user.id].charge = 0;
        },
    },
    troll: {
        name: "Troll",
        power: NaN,
        description: "Does a little trolling and makes the target's hp % be the same as the user's, will fail if the user's hp is greater than 25%",
        accuracy: 100,
        failCheck(user, t, p) {
            
            return (stuff.userHealth[user.id] / p.stats[user.id].health) < 0.25;
        },
        use(logs, c, user, target, p) {
            logs.send(`${user.username} trolled ${target.username}!`)
            var h = p.stats[target.id].health * (stuff.userHealth[user.id] / p.stats[user.id].health);
            if (stuff.userHealth[target.id] <= h) return;
            stuff.userHealth[target.id] = h;
        }
    }
}
delete stuff["counter"]
function hfuni(n) {
    if (isNaN(n)) return null
    if (n > 0) return `+${n}`
    return `${n}`
}
//"[█████████████████████████████████████████▓   ]  92.0%"
/**
 * 
 * @param {Message} msg 
 * @param {*} p 
 */
async function matchInfo(msg, p, i = true, save = true) {
    var rows = []
    var btns = []
    for (var m in stuff.pvpMoves) {
        btns.push(new MessageButton({label: stuff.pvpMoves[m].name, type: "BUTTON", customId: m, style: "PRIMARY"}))
    }
    btns.push(new MessageButton({emoji: "ℹ️", type: "BUTTON", customId: "info", style: "SECONDARY"}))
    var c = 0;
    var acc = []
    for (var b of btns) {
        acc.push(b)
        c++;
        if (c >= 5) {
            c = 0;
            rows.push(new MessageActionRow({components: acc}))
            acc = []
        }
    }
    function funni(v) {
        if (v < 0.25) return "⚠️ "
        return ""
    }
    if (acc.length > 0) rows.push(new MessageActionRow({components: acc}))
    if (!i) rows = []
    console.log(rows)
    var logs = p.logs;
    var j = await stuff.funi(Object.keys(p.stats).map(el => msg.client.users.cache.get(el)).map(user => {
        var s = [...(p.status[user.id] || []).map(el => el.id)]
        var d = p.stats[user.id]
        if (d.charge > 0) {
            s.push({
                name: `${d.charge}x CHRG`,
                color: [0xD0, 0x00, 0xFF, 0xFF]
            })
        }
        if (d.atkmul != 1) {
            s.push({ name: `${d.atkmul.toFixed(2)}x ATK`, color: (d.atkmul >= 1) ? [0x00, 0xff, 0x00, 0xff] : [0xff, 0x00, 0x00, 0xff] })
        }
        if (d.defmul != 1) {
            s.push({ name: `${d.defmul.toFixed(2)}x DEF`, color: (d.defmul >= 1) ? [0x00, 0xff, 0x00, 0xff] : [0xff, 0x00, 0x00, 0xff] })
        }
        var hp = stuff.userHealth[user.id]
        if (!p.users.some(el => el.id == user.id)) {
            hp = 0;
            s = []
        }
        return {
            hp: hp,
            maxhp: p.stats[user.id].health,
            name: user.username,
            status: s,
            prevhp: p.stats[user.id].prevhp ?? p.stats[user.id].health,
        }
    }))
    var b = await j.getBufferAsync(Jimp.MIME_PNG)
    if (save) {
        if (!p.replay) p.replay = []
        p.replay.push(j)
    }
    var ms = await msg.channel.send({ content: `Turn ${p.turn}`, embeds: [{
        /*
        title: "the",
        description: "```\n" + p.users.map(user => {
return `${p.choices.find(e => e.user.id == user.id) ? "✅ " : " "}${user.username.padEnd(54 - 10, " ")}
[${stuff.bar(stuff.userHealth[user.id], p.stats[user.id].health, 45 + 7)}] 
${funni(stuff.userHealth[user.id] / p.stats[user.id].health)}${Math.ceil(stuff.userHealth[user.id])}/${Math.ceil(p.stats[user.id].health)} ${(p.status[user.id] || []).map(el => {
    var e = stuff.pvpStatus[el]
    return `${e.icon} ${e.short}`
}).join(", ") || "No status effects"}`
        }).join("\n\n") + "\n```",
        */
        title: "funi",
        image: {
            url: 'attachment://status.png',
        },
        fields: [
            {
                name: "Logs",
                value: "```\n" + logs?.slice?.(-MAX_LOG_LINES)?.join?.("\n") + "\n```"
            }
        ]
    }], components: rows, files: [new MessageAttachment(b, "status.png")]});
    ms.createMessageComponentCollector({ componentType: "BUTTON", time: 60000 }).on('collect', async (v) => {
        try {
            console.log(`${v.user.tag} ${v.customId}`)
            if (v.customId == "info") {
                await v.reply({
                    ephemeral: true,
                    embeds: [
                        {
                            title: "Detailed info",
                            fields: p.users.map(u => {
                                var stats = p.stats[u.id]
                                var status = p.status[u.id] || []
                                return {
                                    name: u.username,
                                    value: "```" + 
                                    `HP: ${Math.ceil(stuff.userHealth[u.id])}/${stats.health}` + "\n" + 
                                    `Attack: ${stats.attack} (x${stats.atkmul})` + "\n" + 
                                    `Defense: ${stats.defense} (x${stats.defmul})` + "\n" + 
                                    `Speed: ${stats.speed} (x${stats.spdmul})` + "\n" +
                                    `Charge: ${stats.charge || 0}` + "\n" + 
                                    "\n" +
                                    `${status.map(el => `${stuff.pvpStatus[el.id].name} (${el.turns} turns left)`).join("\n") || "No status effects"}` + 
                                    "```"
                                }
                            })
                        }
                    ]
                })
                return;
            }
            if (!p.users.find(u => u.id == v.user.id)) return
            //if (p.choices.find(el => el.user.id == v.user.id)) return
            var rows = []
            var btns = []
            for (var m of p.users) {
                btns.push(new MessageButton({label: m.username, type: "BUTTON", customId: m.id, style: "PRIMARY"}))
            }
            var c = 0;
            var acc = []
            for (var b of btns) {
                acc.push(b)
                c++;
                if (c >= 5) {
                    c = 0;
                    rows.push(new MessageActionRow({components: acc}))
                    acc = []
                }
            }
            if (acc.length > 0) rows.push(new MessageActionRow({components: acc}));
            var r = await v.reply({ content: `${v.user} Choose a target`, components: rows, fetchReply: true });
            var i = await r.awaitMessageComponent({ time: 480000, filter: (u) => u.user.id == v.user.id })
            console.log(`${i.user.tag} ${i.customId}`)
            await i.deferUpdate();
            await r.delete()
            await queueMove(msg, p, v.user, v.customId, msg.client.users.cache.get(i.customId), ms);
        } catch (er) {
            console.log(er)
        }
    }).on('end', () => {

    })
}
function addStatus(b, u, s) {
    if (!b.status[u.id]) b.status[u.id] = []
    var st = b.status[u.id]
    if (!st.some(el => el.id == s)) {
        stuff.pvpStatus[s].onGive(b, u)
        st.push({id: s, turns: stuff.pvpStatus[s].turns || Infinity}) 
    }
}
function removeStatus(b, u, s) {
    if (!b.status[u.id]) b.status[u.id] = []
    var st = b.status[u.id]
    if (st.find(e => e.id == s)) {
        stuff.pvpStatus[s].onTake(b, u)
        st.splice(st.findIndex(e => e.id == s), 1)
    }
}
stuff.matchInfo = matchInfo
async function queueMove(msg, p, user, move, target, ms) {
    if (!p.ready) return;
    if (p.ended) return
    if (user.id != stuff.client.user.id) {
        if (p.users.some(el => el.id == stuff.client.user.id)) {
            if (!p.choices.some(el => el.user.id == stuff.client.user.id)) {
                let users = p.users.filter(el => el.id != stuff.client.user.id)
                let user = users[Math.floor(users.length * Math.random())]
                let move = "bonk"
                //if (!p.status[user.id]?.includes("cringe")) move = "twitter"
                if (p.stats[stuff.client.user.id]?.atkmul < 2 || Math.random() < 0.1) move = "stronk"
                if (Math.random() > 0.6) move = "bonk"
                if (Math.random() > 0.9) move = "ping"
                if (stuff.userHealth[stuff.client.user.id] < 25) move = "troll"
                queueMove(msg, p, stuff.client.user, move, user, ms)
            }
        }
    }
    if (p.choices.find(u => u.user.id == user.id)) return;
    var m = stuff.pvpMoves[move]
    if (!p.logs) p.logs = []
    p.logs.send = function(str) {
        var s = str.split("\n")
        for (var l of s) {
            this.push(l)
        }
    }
    var logs = p.logs;
    p.choices.push({user: user, speedMul: m.speedMul || 0, func: async() => {
        if (p.ended) return
        let m = stuff.pvpMoves[move]
        console.log("funi move")
        console.log(m)
        await logs.send(`${user.username} used ${m.name} (target: ${target.username})`)
        var showMissed = true;
        if (!p.stats[user.id].moveHistory) p.stats[user.id].moveHistory = []
        p.stats[user.id].moveHistory.push(move)
        for (var acc = m.accuracy * p.stats[user.id].accuracy; acc > 0; acc -= 100) {
            if (!isNaN(acc) && Math.random() > (acc / 100)) {
                if (showMissed) {
                    await logs.send(`...But it missed`)
                    showMissed = false
                }
                return
            }
            if (m.failCheck) {
                if (!m.failCheck(user, target, p)) {
                    logs.send(`...But it failed`)
                    continue
                }
            }
            if (!isNaN(acc) && Math.random() < p.stats[user.id].evasion && m.evadable) {
                logs.send(`${user.username} evaded the attack!`)
                continue;
            }
            if (m.beforeUse) await m.beforeUse(logs, msg.channel, user, target, p)
            if (m.use) await m.use(logs, msg.channel, user, target, p)
            else if (m.type == "attack") {
                var atk = p.stats[user.id].atk
                var power = m.power;
                if (m.getPower) power = m.getPower(user, target, p)
                var dmg = calcMoveDamage(power, p.stats[user.id].level, atk, p.stats[target.id].def)
                var mul = 1;
                if (Math.random() < 0.25) {
                    mul *= 2
                    logs.send(`It was a critical hit!11!!!`)
                }
                dmg = takeDamage(p, target, dmg, true, mul)
                logs.send(`${target.username} took ${stuff.format(dmg)} damage`)
            }
            if (m.afterUse) await m.afterUse(logs, msg.channel, user, target, p)
            if (isNaN(acc)) break;
            showMissed = false;
        }
        if (!m.usesCharge) {
            if (p.stats[user.id].charge > 0) p.stats[user.id].charge--;
        }
    }})
    if (p.choices.length >= p.users.length) {
        await ms.delete().catch(console.error)
        var c = p.choices.sort((a, b) => (p.stats[b.user.id].spd) - (p.stats[a.user.id].spd)).sort((a, b) => b.speedMul - a.speedMul)
        for (var choice of c) {
            var i = 0;
            if (stuff.userHealth[choice.user.id] > 0 || p.noEnd) {
                var c = 1;
                //for (var s of (p.status[choice.user.id] || [])) {
                //    if (s == "cringe") c *= 0.75
                //}
                if (Math.random() < c) {
                    await choice.func()
                } 
            }
            var u = choice.user
            if (p.status[u.id]) {
                var l = [...p.status[u.id]]
                for (var st of l) {
                    stuff.pvpStatus[st.id].onTurn(p, u)
                    st.turns--;
                    if (st.turns <= 0) {
                        removeStatus(p, u, st.id)
                    }
                }
            }
            for (let u of p.users) {
                if (stuff.userHealth[u.id] > 0) {
                    i++;
                    continue;
                }                        
                logs.send(`${u.username} Fukin died`)
                if (!p.noEnd) stuff.pvp[u.id] = null;
                if (!p.noEnd) p.users[i] = null;
                var m = Number((stuff.getMoney(u.id, "ip") / 2n) + "")
                stuff.addMoney(u.id, -m, "ip")
                var xp = stuff.getXP(u.id)
                if (!p.fair) xp += (stuff.getLevel(u.id) * 55)
                xp += Math.max(10 - p.turn, 0) * 10;
                p.xpReward += xp;
                p.ipReward += m;
                stuff.db.data[u.id].xp = 0
                if (!p.noEnd) stuff.userHealth[u.id] = stuff.getMaxHealth(u.id)
                else stuff.userHealth[u.id] = p.stats[u.id].health
            }
            p.users = p.users.filter(el => el)
            if (p.users.length <= 1 && !p.noEnd) {
                var w = p.users[0]
                if (stuff.userHealth[w.id] > 0) {
                    stuff.db.data[w.id].matchesWon = (stuff.db.data[w.id].matchesWon || 0) + 1
                    await msg.channel.send({ content: `${w} Fukin won, got <:ip:770418561193607169> ${stuff.format(p.ipReward)} and ${stuff.format(p.xpReward)} XP`, files: [new MessageAttachment(Buffer.from(logs.join("\n")), "log.txt")] })
                    await matchInfo(msg, p, false)
                    stuff.addXP(w.id, p.xpReward, msg.channel)
                    stuff.addPoints(w.id, p.ipReward)
                    stuff.pvp[w.id] = null;
                    stuff.userHealth[w.id] = stuff.getMaxHealth(w.id)
                } else {
                    await msg.channel.send({ content: `It was a fukin' tie!`, files: [new MessageAttachment(Buffer.from(logs.join("\n")), "log.txt")] })
                }
                p.ended = true;
                for (var u of p.users) {
                    stuff.pvp[u.id] = null;
                }
                var e = await msg.channel.send({ content: `The match has ended, would you like to see the images generated?`, components: [
                    new MessageActionRow({ components: [
                        new MessageButton({ customId: "yes", label: "Yes", style: "SUCCESS" }),
                        new MessageButton({ customId: "no", label: "No", style: "DANGER" })
                    ] })
                ] })
                var g = await e.awaitMessageComponent()
                await g.deferUpdate()
                if (g.customId == "yes") {
                    var i = 0;
                    var attachments = []
                    var w = Math.max(...p.replay.map(el => el.getWidth()))
                    var j = await Jimp.create(w, p.replay.reduce((prev, cur) => prev + cur.getHeight() + 8, 0), 0x000000ff)
                    var ypos = 0;
                    for (var img of p.replay) {
                        await j.blit(img, 0, ypos)
                        ypos += img.getHeight() + 8;
                    }
                    await j.resize(1024, Jimp.AUTO, Jimp.RESIZE_NEAREST_NEIGHBOR)
                    attachments.push(new MessageAttachment(await j.getBufferAsync(Jimp.MIME_PNG), "status.png"))
                    if (attachments.length > 0) {
                        await e.channel.send({ files: attachments })
                    }
                } 
                p.replay = []
                await e.delete()
                return;
            }
        }
        p.choices = []
        p.turn++;
        await matchInfo(msg, p)
        for (var u of p.users) {
            p.stats[u.id].prevhp = stuff.userHealth[u.id]
        }
    } else {}
}
function repeat(char, times) {
    var str = ""
    for (var i = 0; i < times; i++) {
        str += char;
    }
    return str
}
function getBar(amt, max, w = 25, align = "left") {
    var bg = "⬛"
    var gr = "🟩"
    var yl = "🟨"
    var rd = "🟥"
    var fl = rd
    var p = amt / max
    if (p > 0.25) fl = yl
    if (p > 0.5) fl = gr
    var a = stuff.clamp(Math.ceil(p * w), 0, w)
    return `${repeat(fl, a) + repeat(bg, w - a)}`
}
module.exports = {
    name: "pvp-do",
    useArgsObject: true,
    aliases: ["do"],
    arguments: [
        {
            type: "string",
            name: "action",
            validValues: ["attack", "end"]
        },
        {
            type: "string",
            name: "args",
        }
    ],
    async execute(msg, args) {
        var p = stuff.pvp[msg.author.id]
        if (p) {
            if (args.action == "end") {
                for (var user of p.users) {
                    stuff.pvp[user.id] = null
                }
                await msg.channel.send(`Ended match`)
                return;
            }
            if (args.action == "status") {
                await matchInfo(msg, p, true, false)
                return
            }
        }
        var a = args.args.split(" ")
        var m = stuff.pvpMoves[a[0]]
        if (args.action == "attack" && !m) {
            msg.channel.send({embed: {
                title: "List of moves",
                fields: Object.entries(stuff.pvpMoves)
                .map(([k, v]) => ({
                    inline: true,
                    name: `${v.name} (\`${k}\`)`,
                    value: 
`
Power: ${v.power || "-"}
Accuracy: ${v.accuracy || "-"}
Priority: ${hfuni(v.speedMul || 0)}
${v.description}
`
                }))
            }})
            return
        }
        if (!p || !p.ready) throw `You must be in a ready match in order to use this`
        var logs = p.logs;
        if (args.action == "log") {
            msg.channel.send({ content: `me when log`, files: [new MessageAttachment(Buffer.from(logs.join("\n")), "log.txt")] })
            return
        }
        if (p.choices.find(el => el.user.id == msg.author.id)) throw `You can't change your choice`
        if (args.action == "attack") {
            var t = (a[1] || "").replace("!", "")
            console.log(t)
            var target = p.users.find(el => el.id == t.slice(2, -1)) || p.users.find(el => stuff.userHealth[el.id] > 0 && el.id != msg.author.id)
            await queueMove(msg, p, msg.author, a[0], target)
        }
    }
}
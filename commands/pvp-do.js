const { Message, MessageAttachment, MessageButton, MessageActionRow, MessageComponentInteraction, Client, ButtonInteraction } = require('discord.js');
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
    return Math.ceil(((atk / def) * (power / 10)) * (level / 2))
}
function takeDamagePower(p, user, target, power, mul) {
    var dmg = calcMoveDamage(power, p.stats[user.id].level, p.stats[user.id].atk, p.stats[target.id].def)
    return takeDamage(p, target, dmg, true, mul)
}
function addField(p, field) {
    var found = p.fieldStatus.find(el => el.id == field)
    if (found) return found
    var o = {
        id: field,
        turns: stuff.fieldStatus[field].turns
    }
    p.fieldStatus.push(o)
    var st = stuff.fieldStatus[field]
    if (st.start) st.start(p, st)
    return o
}
function removeField(p, field) {
    var found = p.fieldStatus.find(el => el.id == field)
    if (!found) return
    var st = stuff.fieldStatus[field]
    var i = p.fieldStatus.findIndex(el => el.id == field)
    p.fieldStatus.splice(i, 1)
    if (st.end) st.end(p, st)
}
stuff.addField = addField
stuff.removeField = removeField
const MAX_LOG_LINES = 15
stuff.pvpItems = {
    egg: {
        removeUse: true,
        use(p, user, it) {
            statB("atk", user, p, 2, p.logs)
            statB("def", user, p, 2, p.logs)
            statB("spd", user, p, 2, p.logs)
        }
    },
    eggs: {
        removeUse: true,
        turn(p, user, it) {
            var heal = p.stats[user.id].health * 0.05
            if (stuff.userHealth[user.id] + heal <= p.stats[user.id].health) {
                stuff.userHealth[user.id] += heal
                p.logs.send(`${user.username} Restored ${Math.floor(heal)} HP from eggs!`)
            }
        },
        use(p, user, it) {
            stuff.userHealth[user.id] = p.stats[user.id].health
            for (var s of p.status[user.id]) {
                removeStatus(p, user.id, s.id)
            }
            p.logs.send(`${user.username} Fully healed!`)
        }
    },
    battery: {
        removeUse: true,
        use(p, user, it) {
            statB("spd", user, p, 1, p.logs)
            statB("chg", user, p, 6, p.logs)
        }
    },
    shield: {
        turn(p, user, it) {
            var stats = p.stats[user.id]
            if (!it.health) it.health = stats.health / 3
            if (stuff.userHealth[user.id] <= stats.prevhp - (stats.health / 10)) {
                stats.bloc = 1
                stats.blocturns = -1
                //it.remove = true
                p.logs.send(`${user.username}'s shield protected them from damage! (Shield health: ${Math.floor(it.health)})`)
                it.health -= stats.prevhp - stuff.userHealth[user.id]
                if (it.health <= 0) {
                    it.remove = true
                    p.logs.send(`${user.username}'s shield broke!`)
                }
            }
        }
    }
}
stuff.fieldStatus = {
    no_random: {
        name: "No-Aletorio",
        icon: "🎲",
        description: "Disables random events",
        turns: 5,
        start(p) {
            p.logs.push("A strange aura surrounds the battlefield. Randomness has been disabled!")
        },
        end(p) {
            p.logs.push("The strange aura wore off")
        }
    },
    radiation: {
        name: "Radiation",
        icon: "☢️",
        description: "Everyone will take damage each turn, damage depends on how many turns are left before the radiation wears off",
        turns: 10,
        turnStart: true,
        start(p) {
            p.logs.push("Radiation surrounds the battlefield. Who the fuck decided to run a nuclear reactor in the middle of a battle?")
        },
        turn(p, st) {
            for (var u of p.users) {
                takeDamage(p, u, p.stats[u.id].health * (0.01 + (0.005 * st.turns)), true)
                p.logs.push(`${u.username} is hurt by radiation!`)
            }
        },
        end(p) {
            p.logs.push("The radiation wore off")
        }
    },
    unstable: {
        name: "Unstable Grounds",
        icon: "🟫",
        description: "Everyone will randomly take damage every turn, always does damage if No-Aletorio is active",
        turns: 7,
        turnStart: true,
        start(p) {
            p.logs.push("An earthquake has started. Did your mom have a gliding accident?")
        },
        turn(p, st) {
            for (var u of p.users) {
                if (Math.random() < 0.25) {
                    takeDamage(p, u, p.stats[u.id].health/8)
                    p.logs.push(`${u.username} is hurt by the earthquake!`)
                }
            }
        },
        end(p) {
            p.logs.push("The earthquake has ended")
        }
    },
    blinding: {
        name: "Blinding Sunlight",
        icon: "☀️",
        description: "All moves' accuracy drops by 25%, causes everyone to get a burn while it's active",
        turns: 5,
        turnStart: true,
        start(p) {
            p.logs.push("The sun turned extrmely harsh. Who the fuck enabled discord light mode?")
        },
        turn(p) {
            for (var u of p.users) {
                addStatus(p, u, "burn")
            }
        },
        end(p) {
            p.logs.push("The sun is back to normal")
        }
    }
}
stuff.pvpStatus = {
    poison: {
        name: "Poisoned",
        short: "POISN",
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
    burn: {
        name: "Burned",
        short: "BURND",
        turns: 5,
        color: [0xFF, 0x50, 0x00, 0xFF],
        onGive(b, u) { b.logs.send(`${u.username} has been burned!`) },
        onTurn(b, u) { 
            var a = Math.ceil(b.stats[u.id].health * 0.03)
            if (b.fieldStatus.some(el => el.id == "blinding")) {
                a *= 2
            }
            takeDamage(b, u, a, true)
            b.logs.send(`${u.username} takes ${a} damage from the burn!`)
        },
        onTake(b, u) { b.logs.send(`${u.username} is no longer burned!`) },
    },
    cringe: {
        name: "Cronge",
        short: "CRONG",
        turns: 8,
        color: [0x61, 0x80, 0x39, 0xff],
        icon: "⬜",
        onGive(b, u) { b.logs.send(`${u.username} cronged!`); b.stats[u.id].defmod-- },
        onTurn(b, u) { 
            var a = Math.ceil(b.stats[u.id].health * (0.02 + (Math.floor(b.turn / 3) * 0.01)))
            takeDamage(b, u, a, true)
            b.logs.send(`${u.username} takes ${a} damage from the cronge!`)
        },
        onTake(b, u) { b.logs.send(`${u.username} is no longer cronged!`); b.stats[u.id].defmod++ },
    },
    frozen: {
        name: "Frozen",
        short: "FRZ",
        turns: 5,
        color: [0x00, 0x80, 0xff, 0xff],
        onGive(b, u) { b.logs.send(`${u.username} froze!`); b.stats[u.id].defmod += 12 },
        onTurn(b, u) { },
        onTake(b, u) { b.logs.send(`${u.username} is no longer frozen!`); b.stats[u.id].defmod -= 12 },
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
// 🗡️ 🛡️ ⚪ 🔺
var categories = {
    attack: {
        icon: "🗡️",
        name: "Attack"
    },
    defense: {
        icon: "🛡️",
        name: "Defense/Counter"
    },
    status: {
        icon: "⚪",
        name: "Status"
    },
    boost: {
        icon: "🔺",
        name: "Stat Boost",
        green: true,
    }
}
function statB(stat, user, p, amt, logs) {
    var logs = logs
    var stats = {
        atk: "Attack",
        def: "Defense",
        spd: "Speed",
        chg: "Charge Rate",
    }
    var name = stats[stat]
    if (amt > 0) {
        if (amt > 1) {
            logs.send(`${user.username}'s ${name} rose sharply! (${hfuni(amt)})`)
        } else {
            logs.send(`${user.username}'s ${name} rose! (${hfuni(amt)})`)
        }
    } else {
        if (amt < -1) {
            logs.send(`${user.username}'s ${name} fell harshly! (${hfuni(amt)})`)
        } else {
            logs.send(`${user.username}'s ${name} fell! (${hfuni(amt)})`)
        }
    }
    p.stats[user.id][stat + "mod"] += amt
}
stuff.pvpMoves = {
    bonk: {
        name: "Bonk",
        power: 50,
        accuracy: 100,
        type: "attack",
        category: "attack",
        description: "A bonk",
        evadable: true,
    },
    ping: {
        name: "Ping Attack",
        power: 200,
        accuracy: 100,
        type: "attack",
        category: "attack",
        description: "A powerful ping attack, has quite a bit of recoil damage",
        evadable: true,
        afterUse(logs, c, user, target, p) {
            stuff.userHealth[user.id] -= p.stats[user.id].health / 4
            logs.send(`${user.username} is hurt by the recoil!`)
            statB("atk", user, p, -2, logs)
        }
    },
    twitter: {
        name: "Twitter",
        power: NaN,
        accuracy: 95,
        category: "status",
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
        category: "boost",
        targetself: true,
        description: "Increases the user's attack",
        use(logs, c, user, target, p) {
            p.stats[user.id].atkmod++;
            logs.send(`${user.username}'s Attack rose!'`)
        }
    },
    tonk: {
        name: "Tonk",
        power: NaN,
        accuracy: 100,
        category: "boost",
        targetself: true,
        description: "Increases the user's defense",
        use(logs, c, user, target, p) {
            p.stats[user.id].defmod++;
            logs.send(`${user.username}'s Defense rose!'`)
        }
    },
    charge_boost: {
        name: "Charge Boost",
        power: NaN,
        accuracy: 100,
        targetself: true,
        speedMul: 1,
        category: "boost",
        description: "Increases the user's stats depending on charge",
        usesCharge: true,
        failCheck(user, t, p) {
            if (p.stats[user.id].charge <= 0) return false
            return true
        },
        use(logs, c, user, target, p) {
            var charge = p.stats[user.id].charge
            if (charge > 3) {
                statB("chg", user, p, Math.ceil((charge - 2) / 3), logs)
            }
            var boost = Math.ceil(charge / 2)
            statB("atk", user, p, boost, logs)
            statB("def", user, p, boost, logs)
            p.stats[user.id].charge -= charge
        }
    },
    counter: {
        name: "Counter",
        power: NaN,
        accuracy: 100,
        category: "attack",
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
        category: "boost",
        targetself: true,
        description: "Charges funi attacc",
        failCheck(user, t, p) {
            return p.stats[user.id].charge < 100;
        },
        use(logs, c, user, target, p) {
            var add = Math.floor(p.stats[user.id].chgmul)
            if (Math.random() < (p.stats[user.id].chgmul % 1)) {
                add++
            }
            p.stats[user.id].charge += add;
            logs.send(`${user.username} is charging... (+${add})`)
        },
    },
    release: {
        name: "Release",
        power: NaN,
        accuracy: 100,
        category: "attack",
        usesCharge: true,
        type: "attack",
        getPower(user, t, p) {
            return (p.stats[user.id].charge * (1 + (p.stats[user.id].charge / 3))) * 50;
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
        category: "attack",
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
    },
    bloc: {
        name: "Bloc",
        power: NaN,
        speedMul: 1,
        category: "defense",
        accuracy: 100,
        targetself: true,
        description: "Blocks incoming damage, success rate is lower if it's used repeatedly",
        failCheck(user, t, p) {
            console.log("Le check")
            var turns = p.stats[user.id].blocturns
            if (Math.random() < 1 / (turns + 1)) return true
            return false
        },
        use(logs, c, user, target, p) {
            console.log("Le use")
            p.stats[user.id].bloc = 1
            logs.send(`${user.username} is blocking`)
            //p.stats[user.id].charge -= Math.min(p.stats[user.id].charge, 5)
        }
    },
    item: {
        name: "Item",
        power: NaN,
        speedMul: 4,
        category: "status",
        targetself: true,
        description: "Uses your held item",
        accuracy: 100,
        failCheck(user, t, p) {
            var stats = p.stats[user.id]
            if (stats.helditem.length <= 0) return false
            var it = stats.helditem[0]
            if (!stuff.pvpItems[it.id]) return false
            return true
        },
        use(logs, c, user, target, p) {
            var stats = p.stats[user.id]
            var it = stats.helditem[0]
            if (stuff.pvpItems[it.id].removeUse) {
                stats.helditem.shift()
            }
            stuff.pvpItems[it.id].use(p, user, it)
        }
    }
}
function brub(n, max = 6) {
    var c = 0
    var abs = Math.abs(n)
    var str = ""
    var pfill = "+"
    var nfill = "-"
    var bg = " "
    while (c < abs) {
        if (n > 0) {
            str += pfill
        } else {
            str += nfill
        }
        c++
    }
    while (c < max) {
        str += bg
        c++
    }
    return str
}
delete stuff["counter"]
function hfuni(n) {
    if (isNaN(n)) return null
    if (n > 0) return `+${n.toFixed(2)}`
    return `${n.toFixed(2)}`
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
        btns.push(new MessageButton({label: stuff.pvpMoves[m].name, type: "BUTTON", customId: m, style: "PRIMARY", emoji: categories[stuff.pvpMoves[m].category].icon}))
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
    var mul = ["atk", "def", "spd", "chg"]
    var ms = await msg.channel.send({ content: `Turn ${p.turn}`, embeds: [{
        
        description: "```\n" + p.users.map(user => {
            var lstr = `LV. ${p.stats[user.id].level}`
return ` ${user.username.padEnd(20 - lstr.length, " ")}${lstr}
[${stuff.bar(stuff.userHealth[user.id], p.stats[user.id].health, 20)}] 
${funni(stuff.userHealth[user.id] / p.stats[user.id].health)}${Math.ceil(stuff.userHealth[user.id])}/${Math.ceil(p.stats[user.id].health)} ${(p.status[user.id] || []).map(el => {
    var e = stuff.pvpStatus[el.id]
    return `${e.name}`
}).join(", ") || "No status effects"}\n${p.stats[user.id].charge ? `${p.stats[user.id].charge} CHARGE\n` : ''}${mul.filter(el => p.stats[user.id][`${el}mul`] != 1).map(el => {
    return `${p.stats[user.id][`${el}mul`].toFixed(2)}x ${el.toUpperCase()}`
}).join(", ") || "No stat changes"}\n> ${p.stats[user.id].helditem.map(el => `${stuff.shopItems[el.id].name}`).join("\n") || "No held items"}`
        }).join("\n\n") + "\n```",
        title: "funi",
        image: {
            url: 'attachment://status.png',
        },
        fields: [
            ...(p.fieldStatus.length ? [
                {
                    name: "Field Effects",
                    value: `${p.fieldStatus.map(el => {
                        var st = stuff.fieldStatus[el.id]
                        return `${st.icon} ${st.name} (${el.turns} Turns)`
                    }).join("\n")}`
                }
            ] : []),
            {
                name: "Logs",
                value: "```\n" + logs?.slice?.(-MAX_LOG_LINES)?.join?.("\n") + "\n```"
            }
        ]
    }], components: rows, files: [new MessageAttachment(b, "status.png")]});
    p.lastinfo = ms
    ms.createMessageComponentCollector({ componentType: "BUTTON", time: 60000 }).on('collect', async (v) => {
        try {
            console.log(`${v.user.tag} ${v.customId}`)
            if (v.customId == "info") {
                await v.reply({
                    // 🗡️ 🛡️ ❤️ 👟 🔋
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
                                    ` ❤️ HP      ${Math.ceil(stuff.userHealth[u.id]).toString().padStart(9, " ")}` + "\n" + 
                                    `        ${("/ " + stats.health.toString()).padStart(9, " ")}` + "\n" + 
                                    `🗡️ Attack  ${stats.attack.toString().padStart(9, " ")} (x${stats.atkmul.toFixed(2).padEnd(9, " ")} ${hfuni(stats.atkmod).padEnd(2, " ")} ${brub(stats.atkmod)})` + "\n" + 
                                    `🛡️ Defense ${stats.defense.toString().padStart(9, " ")} (x${stats.defmul.toFixed(2).padEnd(9, " ")} ${hfuni(stats.defmod).padEnd(2, " ")} ${brub(stats.defmod)})` + "\n" + 
                                    `👟 Speed   ${stats.speed.toString().padStart(9, " ")} (x${stats.spdmul.toFixed(2).padEnd(9, " ")} ${hfuni(stats.spdmod).padEnd(2, " ")} ${brub(stats.spdmod)})` + "\n" +
                                    `🔋 Charge  ${(stats.charge || 0).toString().padStart(9, " ")} (x${stats.chgmul.toFixed(2).padEnd(9, " ")} ${hfuni(stats.chgmod).padEnd(2, " ")} ${brub(stats.chgmod)})` + "\n" + 
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
            var warningColor = "DANGER"
            if (categories[stuff.pvpMoves[v.customId].category].green) {
                warningColor = "SUCCESS"
            }
            for (var m of p.users) {
                btns.push(new MessageButton({label: m.username, type: "BUTTON", customId: m.id, style: (m == v.user.id) ? warningColor : "PRIMARY"}))
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
            var move = stuff.pvpMoves[v.customId]
            var confirm = "Choose a target"
            if (move.targetself) {
                rows = [new MessageActionRow({
                    components: [
                        new MessageButton({label: "Yes", style: "SUCCESS", customId: v.user.id})
                    ]
                })]
                confirm = "Do you want to use this move?"
            }
            var cont = `Epic ID: ${Math.floor(Math.random() * 1024 + Math.random() * 2048 + Math.random() * 4096)}\n\n${categories[move.category].icon} **${move.name}**\nPower: ${move.power || "-"}\nAccuracy: ${move.accuracy || "-"}\nPriority: ${hfuni(move.speedMul || 0)}\nCategory: ${categories[move.category].icon} ${categories[move.category].name}\n${move.description}\n\n${confirm}`
            await v.reply({ content: cont, components: rows, ephemeral: true });
            //var r = await v.fetchReply()
            //var i = await r.awaitMessageComponent({ time: 480000, filter: (u) => u.user.id == v.user.id })
            /**
             * @param {ButtonInteraction} i
             */
            var listener = async(i) => {
                if (i.message.content == cont) {
                    console.log(`${i.user.tag} ${i.customId}`)
                    await queueMove(msg, p, v.user, v.customId, msg.client.users.cache.get(i.customId), ms);
                    await i.reply({content: "k", ephemeral: true})
                } else {
                    i.client.removeListener("interactionCreate", listener)
                }
            }
            v.client.once("interactionCreate", listener)
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
                var ohyes = stuff.client.user
                if (!p.stats[ohyes.id].ai) p.stats[ohyes.id].ai = {
                    chargeChain: 0,
                    chargeFinishMove: ""
                }
                var ai = p.stats[ohyes.id].ai
                let users = p.users.filter(el => el.id != stuff.client.user.id)
                let user = users[Math.floor(users.length * Math.random())]
                let move = "bonk"
                if (!p.status[user.id]?.includes("cringe")) move = "twitter"
                if (p.stats[stuff.client.user.id]?.atkmul < 2 || Math.random() < 0.1) move = "stronk"
                if (Math.random() > 0.6) move = "bonk"
                function getChargeFinish() {
                    if (p.stats[ohyes.id].prevhp < stuff.userHealth[ohyes.id] && Math.random() < 0.5) {
                        return "release"
                    }
                    return "charge_boost"
                }
                if (stuff.userHealth[ohyes.id] > p.stats[ohyes.id].health/4*3 && !ai.chargeChain) {
                    if (Math.random() < 0.5) {
                        ai.chargeFinishMove = getChargeFinish()
                        var min = 4
                        var max = 7
                        if (ai.chargeFinishMove == "release") {
                            min = 3
                            max = 5
                        }
                        ai.chargeChain = min + Math.floor(Math.random() * ((max - min) + 1))
                    }
                }
                if (ai.chargeChain) {
                    move = "charge"
                    ai.chargeChain--
                    if (stuff.userHealth[ohyes.id] < p.stats[ohyes.id].prevhp - (p.stats[ohyes.id].health/6)) {
                        ai.chargeFinishMove = "release"
                    }
                    if (!ai.chargeChain) {
                        move = ai.chargeFinishMove
                    } else {

                    }
                }
                if (stuff.userHealth[ohyes.id] < p.stats[ohyes.id].health / 4 && stuff.userHealth[user.id] > stuff.userHealth[ohyes.id] + (stuff.userHealth[ohyes.id] / 10)) move = "troll"
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
    function createUserTurnData(user) {
        var stats = p.stats[user.id]
        var status = p.status[user.id] || []
        return {
            user: user.name,
            userId: user.id,
            maxHealth: stats.health,
            health: stuff.userHealth[user.id],
            charge: stats.charge,
            attackStages: stats.atkmod,
            defenseStages: stats.defmod,
            speedStages: stats.spdmod,
            chargeRateStages: stats.chgmod,
            evasionStages: stats.evamod,
            accuracyStages: stats.accmod,
            statusEffects: status.map(el => {
                return {
                    id: el.id,
                    turns: el.turns
                }
            }),
            prevhp: stats.prevhp,
        }
    }
    function createUsersObj() {
        var obj = {}
        for (var u of p.users) {
            obj[u.id] = createUserTurnData(u)
        }
        return obj
    }
    p.choices.push({user: user, speedMul: m.speedMul || 0, func: async() => {
        if (p.ended) return
        if (p.status[user.id].some(el => el.id == "frozen")) {
            p.logs.push(`${user.username} is frozen solid`)
            return
        }
        let m = stuff.pvpMoves[move]
        if (move != "bloc") {
            p.stats[user.id].blocturns = 0
        }
        console.log("funi move")
        console.log(m)
        await logs.send(`${user.username} used ${m.name} (target: ${target.username})`)
        var showMissed = true;
        if (!p.stats[user.id].moveHistory) p.stats[user.id].moveHistory = []
        p.stats[user.id].moveHistory.push(move)
        if (!p.turnlog.turns[p.turn]) p.turnlog.turns[p.turn] = {
            moves: [],
        }
        var turnlog = p.turnlog.turns[p.turn].moves
        var missed = false
        var accmul = 1
        if (p.fieldStatus.some(el => el.id == "blinding")) {
            accmul *= 0.75
        }
        for (var acc = m.accuracy * p.stats[user.id].accuracy * accmul; acc > 0; acc -= 100) {
            if (!isNaN(acc) && Math.random() > (acc / 100)) {
                if (showMissed) {
                    await logs.send(`...But it missed`)
                    missed = true
                    showMissed = false
                }
                return
            }
            if (m.failCheck) {
                if (!m.failCheck(user, target, p)) {
                    logs.send(`...But it failed`)
                    missed = true
                    continue
                }
            }
            if (!isNaN(acc) && Math.random() < p.stats[user.id].evasion && m.evadable) {
                logs.send(`${user.username} evaded the attack!`)
                missed = true
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
        turnlog.push({
            user: user.username,
            userId: user.id,
            priority: m.speedMul || 0,
            move: move,
            missed: missed,
            users: createUsersObj()
        })
        p.turnlog.turns[p.turn].time = Date.now()
    }})
    if (p.choices.length >= p.users.length) {
        for (var field of p.fieldStatus) {
            var st = stuff.fieldStatus[field.id]
            if (st.turn) st.turn(p, field)
            field.turns--
        }
        p.fieldStatus = p.fieldStatus.filter(el => {
            if (el.turns <= 0) {
                var st = stuff.fieldStatus[el.id]
                if (st.end) st.end(p, el)
            }
            return el.turns > 0
        })
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
                p.turnlog.endedAt = Date.now()
                var w = p.users[0]
                var files = [new MessageAttachment(Buffer.from(logs.join("\n")), "log.txt"), new MessageAttachment(Buffer.from(JSON.stringify(p.turnlog, null, 4)), "turnlog.json")]
                if (stuff.userHealth[w.id] > 0) {
                    stuff.db.data[w.id].matchesWon = (stuff.db.data[w.id].matchesWon || 0) + 1
                    await msg.channel.send({ content: `${w} Fukin won, got <:ip:770418561193607169> ${stuff.format(p.ipReward)} and ${stuff.format(p.xpReward)} XP`, files: files })
                    await matchInfo(msg, p, false)
                    stuff.addXP(w.id, p.xpReward, msg.channel)
                    stuff.addPoints(w.id, p.ipReward)
                    stuff.pvp[w.id] = null;
                    stuff.userHealth[w.id] = stuff.getMaxHealth(w.id)
                } else {
                    await msg.channel.send({ content: `It was a fukin' tie!`, files: files })
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
        for (var u of p.users) {
            var stats = p.stats[u.id]
            for (var it of stats.helditem) {
                var pi = stuff.pvpItems[it.id]
                if (pi.turn) {
                    pi.turn(p, u, it)
                }
            }
            stats.helditem = stats.helditem.filter(el => !el.remove)
            if (p.stats[u.id].bloc > 0) {
                var bloc = Math.max(Math.min(p.stats[u.id].bloc, 5), 0)
                var dmg = p.stats[u.id].prevhp - stuff.userHealth[u.id]
                var perc = 0.99
                p.stats[u.id].bloc = 0
                p.stats[u.id].blocturns++
                stuff.userHealth[u.id] += dmg * perc
                logs.send(`${u.username} Blocked ${Math.floor((dmg * perc))} damage! (${(perc * 100).toFixed()}%)`)
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
            if (!p.lastinfo || (p.lastinfo && p.lastinfo.deleted)) throw `commit ;do status and try again`
            var t = (a[1] || "").replace("!", "")
            console.log(t)
            var target = p.users.find(el => el.id == t.slice(2, -1)) || p.users.find(el => stuff.userHealth[el.id] > 0 && el.id != msg.author.id)
            await queueMove(msg, p, msg.author, a[0], target, p.lastinfo)
            await msg.reply("k")
        }
    }
}
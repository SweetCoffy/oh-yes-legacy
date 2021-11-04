var stuff = require('../stuff')
var { Message, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const Jimp = require('jimp');
function createEncounter(user, ...enemies) {
    return {
        enemies: [...enemies],
        get ended() {
            return this.enemies.every(el => el.health <= 0) || this.ran
        },
        ran: false,
        user: user,
        queue: [],
        end() {
            if (this.ran) return {xp: 0, ip: 0, items: []}
            var xp = this.enemies.reduce((prev, cur) => prev + (cur.type.xpReward || 0), 0)
            var ip = this.enemies.reduce((prev, cur) => prev + (cur.type.moneyDrop || 0), 0)
            var items = {}
            var u = this.user;
            for (var e of this.enemies) {
                var d = e.type.drops || []
                for (var drop of d) {
                    if (Math.random() > drop.chance) continue;
                    var count = Math.round(stuff.randomRange(drop.min, drop.max))
                    for (var i = 0; i < count; i++) {
                        if (!items[drop.item]) items[drop.item] = 0
                        try {
                            stuff.addItem(u.id, drop.item)
                            items[drop.item]++
                        } catch (er) {

                        }
                    }
                }
            }
            return {xp, ip, items: Object.entries(items).map(el => ({ id: el[0], amount: el[1] }))}
        },
        get aliveEnemies() {
            return this.enemies.filter(el => el.health >= 0)
        }
    }
}
function calcDamage(power, atk, def) {
    return Math.ceil(Math.max((atk - def) * (power / 15), 1))
}
var moves = {
    "bonk": {
        power: 35,
        name: "Bonk",
        type: "attack",
    },
    "wait": {
        power: NaN,
        name: "wait",
        use(e, u, t) {
            
        }
    }
}
stuff.createEncounter = createEncounter
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
        var list = []
        var possibleEnemies = Object.values(stuff.enemies).filter(e => !e.hidden && ((stuff.getMaxHealth(message.author.id) + stuff.getAttack(message.author.id) + stuff.getDefense(message.author.id)) >= (e.minLevel || -1000000)))
        for (var e of possibleEnemies) {
            for (var i = 0; i < 25 - (e.rarity || 0); i++) {
                list.push(e)
            }
        }
        var enemies = []
        var num = Math.ceil(Math.random() * 2);
        for (var i = 0; i < 3; i++) {
            if (Math.random() < 0.2) {
                num *= 2;
            } else break;
        }
        num = stuff.clamp(num, 1, 15)
        while (num > 0) {
            var idx = Math.floor(Math.random() * list.length);
            var _e = list[idx]
            list.splice(idx, 1)
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
                speed: 0,
            }
            e.prevhp = e.health = e.maxHealth;
            enemies.push(e)
            num -= Math.max(Math.ceil((_e.rarity || 0) / 10), 1)
        }
        console.log(list)
        var encounter = createEncounter(message.author, ...enemies)
        var pprevhp = stuff.userHealth[message.author.id]
        if (stuff.fighting[message.author.id] && !stuff.fighting[message.author.id].ended) encounter = stuff.fighting[message.author.id]
        else stuff.fighting[message.author.id] = encounter;
        var logs = encounter.logs || []
        encounter.logs = logs;

        var p = {
            get name() {
                return message.author.username
            },
            get health() {
                return stuff.userHealth[message.author.id]
            },
            set health(v) {
                stuff.userHealth[message.author.id] = v
            },
            get maxHealth() {
                return stuff.getMaxHealth(message.author.id)
            },
            get attack() {
                return stuff.getAttack(message.author.id)
            },
            get defense() {
                return stuff.getDefense(message.author.id)
            },
            get speed() {
                return stuff.getSpeed(message.author.id)
            },
        }
        var queue = []
        var msg = await message.reply({ embeds: [{
            title: `${message.author.username} vs ${encounter.enemies.length} enemies`,
            description: `ur mom`
        }] })
        function useMove(move, user, target, e) {
            var m = moves[move]
            e.logs.push(`${user.name} Used ${m.name}`)
            if (m.beforeUse) m.beforeUse(user, target, e)
            if (m.use) return m.use(user, target, e)
            if (m.type == "attack") {
                var dmg = calcDamage(m.power, user.attack, target.defense)
                target.health -= dmg;
                e.logs.push(`${target.name} Took ${Math.floor(dmg)} damage`)
            }
        }
        console.log("the")
        /**
         * 
         * @param {Message} msg 
         */
        async function update(msg) {
            function queueAction(a) {
                var queue = encounter.queue
                queue.push(a)
                
                if (queue.length > encounter.aliveEnemies.length) {
                    var e = queue.sort((a, b) => b.user.speed - a.user.speed).sort((a, b) => b.priority - a.priority)
                    for (var q of e) {
                        if (q.user.health <= 0) continue;
                        if (q.type == "attack") {
                            useMove(q.move, q.user, q.target, encounter)
                            if (q.user.type?.onKillOther && q.target.health <= 0 && !q.target.dead) q.user.type.onKillOther(encounter, q.user, q.target)
                            if (q.target.health <= 0) q.target.dead = true
                        } else if (q.type == "run") {
                            encounter.ran = true;
                            return
                        }
                    }
                    while (queue.length > 0) {
                        queue.pop()
                    }
                    for (var e of encounter.enemies) {
                        if (!e.dead && e.health <= 0) {
                            e.dead = true;
                            e.health = 0;
                            if (e.type?.onKill) e.type.onKill(encounter, e)
                        }
                    }
                }
            }
            var embed = {
                title: `Funi`,
                description: `${[p, ...encounter.enemies].map(el => `${el.type?.boss ? "[**BOSS**] " : ""}${el.name}\n\`${stuff.bar(el.health, el.maxHealth, 25)}\`${Math.ceil(el.health)}/${Math.ceil(el.maxHealth)}`).join("\n\n")}`,
                fields: [
                    {
                        name: "Log",
                        value: `\`\`\`${logs.slice(-20).join("\n") || "ur mom"}\`\`\``
                    }
                ]
            }
            msg = await msg.edit({
                embeds: [embed],
                components: [
                    new MessageActionRow({
                        components: Object.keys(moves).map(el => new MessageButton({ label: moves[el].name, customId: el, style: "PRIMARY" }))
                    }),
                    new MessageActionRow({
                        components: [
                            new MessageButton({ label: "Run", customId: "run", style: "SECONDARY" })
                        ]
                    })
                ],
            })
            var i = await msg.awaitMessageComponent({filter: (i) => {
                if (i.user.id != message.author.id) {
                    i.reply({ ephemeral: true, content: "This isn't for you, you fucking egger" })
                    return false
                }
                return true;
            }})
            await i.deferUpdate()
            if (i.customId == "run") {
                await msg.delete()
                stuff.fighting[message.author.id] = null
                return
            } else {
                var c = []
                var acc = []
                var idx = 0
                for (var el of encounter.enemies) {
                    acc.push(new MessageButton({ label: el.name, style: "PRIMARY", customId: idx + "", disabled: el.health <= 0, emoji: "🗡️" }))
                    if (acc.length >= 5) {
                        c.push(new MessageActionRow({ components: acc }))
                        acc = []
                    }
                    idx++
                }
                if (acc.length > 0) c.push(new MessageActionRow({ components: acc }))
                await msg.edit({
                    embeds: [...msg.embeds],
                    components: [
                        ...c,

                        new MessageActionRow({
                            components: [
                                new MessageButton({
                                    label: "Back",
                                    emoji: "🔙",
                                    customId: "back",
                                    style: "SECONDARY"
                                })
                            ]
                        })
                    ]
                })
                var j = await msg.awaitMessageComponent({filter: (i) => {
                    if (i.user.id != message.author.id) {
                        i.reply({ ephemeral: true, content: "This isn't for you, you fucking egger" })
                        return false
                    }
                    return true;
                }})
                j.deferUpdate()
                if (j.customId != "back") {
                    console.log(j)
                    var t = encounter.enemies[j.customId]
                    queueAction({
                        user: p,
                        move: i.customId,
                        type: "attack",
                        priority: moves[i.customId].priority || 0,
                        target: t,
                    })
                    for (var e of encounter.enemies) {
                        if (e.health <= 0) continue;
                        var move = "bonk"
                        if (e.type.ai) {
                            move = e.type.ai(e, p, encounter) || move
                        }
                        queueAction({
                            user: e,
                            move: move,
                            type: "attack",
                            priority: moves[move].priority || 0,
                            target: p,
                        })
                    }
                    if (p.health <= 0) {
                        stuff.fighting[message.author.id] = null
                        message.reply("You fucking died")
                        msg.delete()
                        return
                    }
                    if (encounter.ended) {
                        var h = encounter.end()
                        stuff.addXP(message.author.id, h.xp, message.channel)
                        var ip = h.ip * stuff.getMultiplier(message.author.id, false)
                        var items = h.items
                        stuff.addMoney(message.author.id, ip)
                        for (var e of encounter.enemies) {
                            if (e.type.onEnd) e.type.onEnd(encounter, e)
                        }
                        stuff.fighting[message.author.id] = null
                        message.reply(`Got ${stuff.format(ip)} IP and the items: ${items.map(el => stuff.itemP(el.id, el.amount)).join(", ") || "nothing"}`)
                        msg.delete()
                        return;
                    }
                }
            }
            await update(msg)
        }
        await update(msg)
    }
}
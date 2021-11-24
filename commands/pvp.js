var stuff = require('../stuff.js')
if (!stuff.pvp) stuff.pvp = {}
async function joinMatch(msg, p, bypassCheck = false) {
    if (p.ready) throw `me when you can't join`
    if (!bypassCheck & p.invited && p.invited.id != msg.author.id) throw `${p.host} Didn't invite you to their match!`
    if (!bypassCheck & p.host.id == msg.author.id) throw `the fucking sun`
    await msg.channel.send(`Joined ${p.host}'s match`)
    stuff.pvp[msg.author.id] = p;
    p.users.push(msg.author)
    var pclass = stuff.getClass(msg.author.id, true)
    var stats = {
        attack: stuff.calcStat(p.level, pclass.atk, 0),
        defense: stuff.calcStat(p.level, pclass.def, 0),
        health: stuff.calcStat(p.level, pclass.hp, 0),
        level: p.level,
        get atk() {
            return this.attack * this.atkmul;
        },
        get def() {
            return this.defense * this.defmul;
        },
        get spd() {
            return this.speed * this.spdmul;
        },
        evasion: 0,
        accuracy: 1,
        
        atkmod: 0,
        defmod: 0,
        accmod: 0,
        spdmod: 0,
        evamod: 0,
        chgmod: 0,

        helditem: stuff.getHeld(msg.author.id).slice(0, 3).map(el => ({...el})),
        
        get atkmul() {
            return Math.max(Math.min(1 + (this.atkmod / 6), 4), 0.125)
        },
        get defmul() {
            return Math.max(Math.min(1 + (this.defmod / 6), 4), 0.125)
        },
        get accmul() {
            return Math.max(Math.min(1 + (this.accmod / 6), 4), 0.125)
        },
        get spdmul() {
            return Math.max(Math.min(1 + (this.spdmod / 6), 4), 0.125)
        },
        get evamul() {
            return Math.max(Math.min(1 + (this.evamod / 6), 4), 0.125)
        },
        get chgmul() {
            return Math.max(Math.min(1 + (this.chgmod / 12), 4), 0.125)
        },
        
        set atkmul(v) {
            this.atkmod = (v - 1) * 6
        },
        set defmul(v) {
            this.defmod = (v - 1) * 6
        },
        set accmul(v) {
            this.accmod = (v - 1) * 6
        },
        set spdmul(v) {
            this.spdmod = (v - 1) * 6
        },
        set evamul(v) {
            this.evamod = (v - 1) * 6
        },

        charge: 0,
        speed: stuff.calcStat(p.level, pclass.spd, 0),
    }
    if (!p.fair) {
        stats.attack = stuff.getAttack(msg.author.id)
        stats.defense = stuff.getDefense(msg.author.id)
        stats.health = stuff.getMaxHealth(msg.author.id)
        stats.speed = stuff.getSpeed(msg.author.id)
        stats.level = stuff.getLevel(msg.author.id)
    }
    stats.health *= p.hpmul
    p.stats[msg.author.id] = stats
    p.status[msg.author.id] = []
    if (p.users.length >= p.maxPlayers) {
        p.ready = true
        for (var u of p.users) {
            stuff.userHealth[u.id] = p.stats[u.id].health;
            p.turnlog.users.push({
                user: u.username,
                userId: u.id,
                ...p.stats[u.id],
            })
        }
        p.turnlog.startedAt = Date.now()
        var f = stuff.fieldStatus[p.startfield]
        var id = p.startfield
        if (p.startfield == "random") {
            var keys = Object.keys(stuff.fieldStatus)
            var key = keys[Math.floor(Math.random() * keys.length)]
            f = stuff.fieldStatus[key]
            id = key
        }
        if (f) {
            var f = stuff.addField(p, id)
            f.turns = Math.floor(f.turns * 1.5)
        }
        stuff.matchInfo(msg, p)
    }
}
stuff.joinMatch = joinMatch
module.exports = {
    name: "pvp",
    description: "oh no",
    useArgsObject: true,
    arguments: [
        {
            type: "user",
            name: "user",
            optional: true
        },
        {
            type: "int",
            name: "players",
            optional: true,
            default: 2,
        }
    ],
    async execute(msg, args, _h, h) {   
        if (!args.user) throw `Why`
	    if (args._user != "any" && args.user.id == msg.author.id) throw `You can't create a match against yourself!`
        var p = stuff.pvp[msg.author.id]
        console.log(p)
        if (!p) {
            if (stuff.pvp[args.user.id]) {
                await joinMatch(msg, stuff.pvp[args.user.id])
            } else {
                if (args.players < 2 && !h.ohno) throw `The match must have at least 2 players!`
                p = stuff.pvp[msg.author.id] = {
                    invited: (args._user == "any") ? null : args.user,
                    host: msg.author,
                    users: [],
                    turn: 0,
                    level: Number(h.level) || 50,
                    startfield: h.startfield || "",
                    noEnd: h.ohno,
                    ready: false,
                    maxPlayers: args.players,
                    choices: [],
                    fieldStatus: [],
                    logs: [],
                    ipReward: 0,
                    xpReward: 0,
                    fair: !h.unfair,
                    hpmul: Number(h.hpmul) || 1,
                    status: {},
                    get randomEvents() {
                        if (this.fieldEffects.some(el => el.id == "no_random")) return false
                        return true
                    },
                    stats: {},
                    turnlog: {
                        users: [],
                        turns: []
                    },
                }
                p.logs.send = function(str) {
                    p.logs.push(str)
                }
                p.turnlog.rules = {
                    maxPlayers: p.maxPlayers,
                    level: p.level,
                    endless: p.noEnd,
                    unfair: !p.fair,
                    hpmul: p.hpmul,
                    startfield: p.startfield,
                }
                p.turnlog.info = {
                    moves: stuff.pvpMoves,
                    statusEffects: stuff.pvpStatus,
                }
                console.log(p)
                await joinMatch(msg, p, true)
                await msg.channel.send(`Created a match`)
                if (args.user.id == msg.client.user.id) {
                    await joinMatch(await msg.channel.send("omw to join"), p, true)
                }
            }
        } else {
            var embed = {
                title: `Match info`,
                description: `Users: ${p.users.join(", ")}\nReady: ${p.ready ? "Yes" : "No"}\nTurn: ${p.turn}`,
            }
            await msg.channel.send({embed: embed})
        }
    }
}

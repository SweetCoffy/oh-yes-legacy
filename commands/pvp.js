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
        atkmul: 1,
        defmul: 1,
        accmul: 1,
        spdmul: 1,
        evmul: 1,
        charge: 0,
        speed: stuff.calcStat(p.level, pclass.spd, 0),
    }
    if (!p.fair) {
        stats.attack = stuff.getAttack(msg.author.id)
        stats.defense = stuff.getDefense(msg.author.id)
        stats.health = stuff.getMaxHealth(msg.author.id)
        stats.speed = stuff.getSpeed(msg.author.id)
        stats.level = stuff.getLevel(msg.author.id)
    } else if (p.quick) {
        if (p.quicklevel > 0) {
            for (var i = p.quicklevel; i >= 0; i--) {
                stats.health /= 2;
            }
        } else {
            var l = Math.abs(p.quicklevel)
            for (var i = 0; i < l; i++) {
                stats.health *= 2;
            }
        }
    }

    p.stats[msg.author.id] = stats
    if (p.users.length >= p.maxPlayers) {
        p.ready = true
        for (var u of p.users) {
            stuff.userHealth[u.id] = p.stats[u.id].health;
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
                    noEnd: h.ohno,
                    ready: false,
                    maxPlayers: args.players,
                    choices: [],
                    ipReward: 0,
                    xpReward: 0,
                    fair: !h.unfair,
                    quick: "quick" in h,
                    quicklevel: Math.max(Math.min((Number(h.quick) || 1) - (Number(h.nquick) || 0), 32), -32),
                    status: {},
                    stats: {},
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

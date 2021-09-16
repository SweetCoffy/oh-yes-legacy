var stuff = require('../stuff')
stuff.achievements = {
    "stonks:omega": {
        icon: "<:ip:770418561193607169>"
    },
    "stonks:gold": {
        icon: "🪙",
    },
    "other:prestige": {
        icon: "<:v_gun:832601197163577454>",
    },
    "other:ascend": {
        icon: "<:thefukinsun:819716692602781696>",
    },
    "other:oblivion": {
        icon: "🌌",
    },
    "other:eggflag": {
        icon: "<:eggflag:779124272832053319>",
    },
    "other:venezuela": {
        icon: ":flag_ve:",
    },
    "easteregg:ivetory": {
        icon: "📦"
    },
    "easteregg:sv_cheats1": {
        icon: "<:kekw:799990366036033546>"
    },

}
module.exports = {
    name: "achievement",
    useArgsObject: true,
    arguments: [
        {
            name: "user",
            type: "user",
            default: "me",
            optional: true,
        }
    ],
    async execute(message, args) {
        var userObj = stuff.db.data[args.user?.id] || stuff.db.data[message.author.id]
        if (!userObj) throw `the no`
        var a = stuff.achievements
        var ac = Object.entries(stuff.achievements)
        userObj.achievements = userObj.achievements || []
        var embed = {
            title: "Achievements",
            description: `${ac.map(el => {
                var ach = userObj.achievements.find(e => e.id == el[0])
                if (ach) {
                    return `${el[1].icon} **${ach.name}**\n${ach.description}\n`
                } else {
                    return `${el[1].placeholder || "⚫"} ???\n??????????????\n`
                }
            }).join("\n")}`
        }
        await message.channel.send({embed: embed})
    }
}
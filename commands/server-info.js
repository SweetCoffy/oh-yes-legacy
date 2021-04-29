const { Guild, Collection } = require("discord.js");
const stuff = require("../stuff");

module.exports = {
    name: "server-info",
    aliases: [ 'serverinfo' ],
    description: "shows info about the server lol",
    async execute(message, args) {
        /**
         * @type { Guild }
         */
        var guild = message.guild;
        var msg = await message.channel.send(`fetching...`);
        var _members = await guild.members.fetch();
        var bots = _members.filter(v => v.user.bot)
        var members = _members.filter(v => !v.user.bot)
        var days = Math.floor((Date.now() - guild.createdTimestamp) / 1000 / 60 / 60 / 24);
        var totalWorth = {};
        var warnCount = 0;
        for (var [k, v] of _members) {
            var data = stuff.db.data[v.user.id]
            if (data) {
                warnCount += data.warns?.length || 0;
                for (var [kk, vv] of Object.entries(stuff.currencies)) {
                    var m = stuff.getMoney(v.user.id, kk);
                    if (!totalWorth[kk]) totalWorth[kk] = 0n;
                    totalWorth[kk] += m;
                }
            }
        }
        var embed = {
            title: guild.name,
            color: 0x2244ff,
            thumbnail: {url: guild.iconURL() },
            description: `This server is **${((bots.size / _members.size) * 100).toFixed(1)}**% bots`,
            fields: [
                {
                    name: "ID",
                    value: guild.id,
                    inline: true,
                },
                {
                    name: "Existence",
                    value: `**${guild.name}** Has been existing for ${Math.floor(days / 365)} years, ${Math.floor((days / 30) % 12)} months and ${days % 30} days, created at ${guild.createdAt.toUTCString()})`
                },
                {
                    name: "Economy and stuff",
                    value: `This server is worth (oh yes currency)\n${Object.entries(stuff.currencies).map(el => `${el[1].icon} ${stuff.doThing(totalWorth[el[0]])}`).join("\n")}\nWith a total of ⚠️ ${stuff.doThing(warnCount)} Warns`
                },
                {
                    name: "Members",
                    value: `${_members.size} (${bots.size} bots, ${members.size} actual users)`,
                },
                {
                    name: "Region",
                    value: `${guild.region.slice(0, 1).toUpperCase() + guild.region.slice(1)}`,
                },
            ]
        }
        
        msg.edit({content: "", embed: embed})
    }
}
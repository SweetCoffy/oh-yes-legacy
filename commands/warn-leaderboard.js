const stuff = require("../stuff")

module.exports = {
    name: "warn-leaderboard",
    category: "useless",
    aliases: ["warnboard", "warnboards", "wleaderboard", "wboard", "wlboard", "wlb"],
    execute(message) {
        var totalWarns = 0;
        var users = Object.entries(stuff.db.data).sort((a, b) => (b[1].warns?.length || 0) - (a[1].warns?.length || 0));
        var icons = ['🥇', '🥈', '🥉']
        message.channel.send({ content: users.slice(0, 10).map((el, i) => `#${(i + 1).toString().padStart(2, "0")} ${(message.client.users.cache.get(el[0])?.username || `${el[0]}`).padEnd(32, " ")} ${(el[1].warns?.length > 0) ? `⚠️ ${stuff.doThing(el[1].warns?.length || 0)}` : `❌ No`}`).join("\n"), code: true, split: true })
    }
}
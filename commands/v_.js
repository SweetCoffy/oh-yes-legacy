const stuff = require('../stuff')
module.exports = {
    name: "v_",
    description: "shows a <:v_:755546914715336765> leaderboard",
    async execute(message) {
        //<:v_1:750501468385050624> <:voidv_:803753907456180294> <:painv_:831661689715818516> <:coalv_:845046408947040256>
        var members = await message.guild.members.fetch()
        var totalV = 0;
        var users = Object.entries(stuff.db.getData('/'))
        .sort((a, b) => {
            var a_ = (a[1].vCounter || 0) + (a[1].v_1 || 0) + (a[1].voidv_ || 0) + (a[1].painv_ || 0) + (a[1].coalv_ || 0);
            var b_ = (b[1].vCounter || 0) + (b[1].v_1 || 0) + (b[1].voidv_ || 0) + (b[1].painv_ || 0) + (b[1].coalv_ || 0);
            a[1].total = a_;
            b[1].total = b_;
            return b_ - a_;
        })
        .filter(el => {
            var h = !((members.get(el[0]) || { user: {} }).user.bot)
            if (h) totalV += (el[1].vCounter || 0) + (el[1].v_1 || 0) + (el[1].voidv_ || 0) + (el[1].painv_ || 0) + (el[1].coalv_ || 0);
            return h;
        } )
        .map((el, i) => ({ inline: true, name: `#${i + 1} ${message.client.users.cache.get(el[0])?.username || el[0]} (Total: ${el[1].total})`, value: `<:v_:755546914715336765> ${stuff.getVCounter(el[0])}\n<:v_1:750501468385050624> ${el[1].v_1 || 0}\n<:voidv_:803753907456180294> ${el[1].voidv_ || 0}\n<:painv_:831661689715818516> ${el[1].painv_ || 0}\n<:coalv_:845046408947040256> ${el[1].coalv_ || 0}` }))
        .slice(0, 12)
        var embed = {
            title: "<:v_:755546914715336765> Leaderboard",
            color: 0x4287f5,
            fields: users,
            footer: { text: `Total: ${totalV}` }
        }
        message.channel.send({embed: embed})
    }
}
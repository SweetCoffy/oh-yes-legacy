const stuff = require("../stuff")

module.exports = {
    name: "boss",
    execute(message) {
        var boss = stuff.currentBoss || {};
        var embed = {
            title: boss.name || "Not available",
            color: 0x0398fc,
            fields: [
                {
                    name: "Health",
                    value: `${stuff.format(boss.health || 0)}/${stuff.format(boss.maxHealth || 0)}`,
                    inline: true,
                },
                {
                    name: "Damage",
                    value: `${stuff.format(boss.damage)}`,
                    inline: true,
                },
                {
                    name: "Currently fighting",
                    value: (boss.fighting || []).map(el => `<@${el}>`).join(", ") || 'nobody'
                }
            ]
        }
        message.channel.send({embed: embed});
    }
}
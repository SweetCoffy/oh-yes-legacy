var { RestrictedCommand } = require('../../commands');
var { BitField } = require('discord.js')
const stuff = require('../../stuff');
var thing = o => {
    var a = [];
    if (Array.isArray(o)) {
        o.forEach(e => a.push(thing(e)))
    } else {
        if ('deny' in o && 'allow' in o) {
            a.push(`<@${(o.type == 'role') ? '&' : '!'}${o.id}> ✅ Allow: ${new BitField(o.allow).toArray().map(el => stuff.thing(stuff.snakeToCamel(el.toLowerCase()))).join(", ") || "<nothing>"}, ❌ Deny: ${new BitField(o.deny).toArray().map(el => stuff.thing(stuff.snakeToCamel(el.toLowerCase()))).join(", ") || "<nothing>"}`);
        } else {
            a.push(o.toString())
        }
    }
    return a.join('\n')
}
module.exports = new RestrictedCommand('get', async (message, args) => {
    var guild = message.guild;
    var logs = await guild.fetchAuditLogs()
    var log = logs.entries.get(args.id)

    var embed = {
        author: {
            name: log.executor.username,
            iconURL: log.executor.avatarURL(),
        },
        title: stuff.thing(stuff.snakeToCamel(log.action.toLowerCase())),
        fields: [
            {
                name: "Target",
                value: `${log.target} (type: ${(log.target || { constructor: { name: "unknown" } }).name})\n${Object.entries(log.target).filter(el => typeof el[1] == 'string' || typeof el[1] == 'number' || typeof el[1] == 'bool').map(el => `**${el[0]}**: ${el[1]}`).join('\n')}`
            },
            {
                name: "Changes",
                value: ((log.changes || []).map(el => `**${stuff.thing(stuff.snakeToCamel(el.key))}**: ${(typeof el.old == 'object') ? thing(el.old) : el.old} -> ${(typeof el.new == 'object') ? thing(el.new) : el.new}`)).join("\n").trim() || "<nothing>"
            }
        ]
    }
    message.channel.send({embed: embed});
}, 'VIEW_AUDIT_LOG', 'Gets an audit log entry').argsObject().addArgumentObject({
    name: "id",
    type: "string",
})

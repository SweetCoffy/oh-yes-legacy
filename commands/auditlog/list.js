var { RestrictedCommand } = require('../../commands');
const stuff = require('../../stuff');
module.exports = new RestrictedCommand('list', async (message) => {
    var guild = message.guild;
    var logs = await guild.fetchAuditLogs({ limit: 20 })
    var embed = {
        title: `Audit Log:`,
        description: logs.entries.map(el => `${el.executor}: \`${el.id}\` ${stuff.thing(stuff.snakeToCamel(el.action.toLowerCase()))}, ${(el.changes || []).length} Changes`).join("\n")
    }
    message.channel.send({embed: embed});
}, 'VIEW_AUDIT_LOG', 'Lists the most recent audit log entries')

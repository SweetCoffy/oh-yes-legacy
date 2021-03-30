var { SubcommandCommand } = require('../commands')
var cmd = new SubcommandCommand('auditlog', ['get', 'list'], "Command for audit log stuff");
cmd.category = "moderation";
module.exports = cmd;
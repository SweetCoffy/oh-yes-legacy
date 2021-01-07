var { SubcommandCommand } = require('../commands')
module.exports = new SubcommandCommand('auditlog', ['get', 'list'], "Command for audit log stuff")
const stuff = require('../stuff')
const { SubcommandCommand } = require('../commands')
module.exports = new SubcommandCommand('permission', ['add', 'remove', 'list'], 'Base command for oh yes permission management')


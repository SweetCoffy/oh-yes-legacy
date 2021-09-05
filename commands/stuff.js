var stuff = require('../stuff')
var SubcommandCommand = require('../SubcommandCommand')
module.exports = new SubcommandCommand("stuff", ['list', 'set', 'get'])
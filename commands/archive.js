const stuff = require('../stuff')
const RestrictedCommand = require('../RestrictedCommand')
var execute = function(message, args) {
    var archive = stuff.getConfig("archiveCategory");
    message.channel.setParent(archive).then (c => {
        c.lockPermissions().then(() => {
            c.send(`the channel has been archived succesfully`);
        })
    })  
}
var cmd = new RestrictedCommand("archive", execute, "MANAGE_CHANNELS", "archives the channel where the command has been performed")
module.exports = cmd

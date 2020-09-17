const stuff = require('../stuff')

module.exports = {
    name: "archive",
    requiredPermission: "commands.archive",
    description: "archives the channel where the command has been performed",

    execute (message, args) {
        var archive = stuff.getConfig("archiveCategory");
        
        
        message.channel.setParent(archive).then (c => {
            c.lockPermissions().then(() => {
                c.send(`the channel has been archived succesfully`);
            })
        })
        

         
       
    }
}
const { MessageAttachment } = require('discord.js');
const stuff = require('../stuff');

module.exports = {
    name: "submit",
    package: "h",
    async execute (message, args, phoneData, slot) {
        if (message.attachments.first()) {
            var attachment = message.attachments.first();
            if (attachment.name.endsWith("js")) {
                await stuff.submit(attachment.url, attachment.name);
                message.channel.send("command submitted succesfully, now wait 40 solar eclipses for it to be reviewed and approved");
            } else {
                throw "file must be a .js file"
            }
        } else {
            throw "egg"
        }
        
    }
}
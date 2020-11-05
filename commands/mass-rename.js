const RestrictedCommand = require('../RestrictedCommand');
const stuff = require('../stuff');
const { Message, GuildMember } = require('discord.js');

/**
 * 
 * @param {Message} message 
 * @param {string[]} args 
 */
var execute = async (message, args) => {
    var name = args.join(" ");
    
    if (args.length < 1) name = "";
    try {
        await message.channel.send(`Fetching members...`);
        
        var start = Date.now();
        var members = await message.guild.members.fetch();
        
        var finish = Date.now();
        await message.channel.send(`Finished fetching members, took ${((finish - start) / 100).toFixed(1)}s`);
        /**
         * @type GuildMember[]
         */
        var renamed = [];
        members.forEach(async member => {
            if (member.manageable && member.nickname != name) {
                var newMember = await member.setNickname(name);
                renamed.push(newMember)

            }
        })


    } catch (err) {
        stuff.sendError(message.channel, err);
    }

}
var cmd = new RestrictedCommand("mass-rename", execute, "MANAGE_NICKNAMES", "oh no");
module.exports = cmd;
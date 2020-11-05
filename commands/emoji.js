const { Message, Collection, GuildEmojiRoleManager } = require("discord.js");
const stuff = require("../stuff");
const RestrictedCommand = require('../RestrictedCommand');
/**
 * 
 * @param {Message} message 
 * @param {string[]} args 
 */
var execute = async function(message, args) {
    try {
        if(args.length < 1) throw "e"
        var guild = message.guild;
        var emojis = guild.emojis.cache;
        var emoji = emojis.filter(v => v.name == args[0] || v.id == args[0]).first();
        var roleid = (args[2] || "").replace(/<@&(\d+)>/, "$1");
        var role = await guild.roles.fetch(roleid)
        if (args[1] == "add") {
            if (!role) throw "invalid role"
            var updated = await emoji.roles.add(role);
            var embed = {
                author: {
                    name: emoji.name,
                    icon_url: emoji.url
                },
                //title: "lol",
                description: `Updated ${updated}, The emoji's whitelisted roles now are:\n${updated.roles.cache.map(el => el.toString()).join("\n")}`
            }
            await message.channel.send({embed: embed});
        } else if (args[1] == "remove") {
            if (!role) throw "invalid role"
            var updated = await emoji.roles.remove(role);
            var h = updated.roles.cache.map(el => el.toString());
            var embed = {
                author: {
                    name: emoji.name,
                    icon_url: emoji.url
                },
                //title: "lol",
                description: `Updated ${updated}, The emoji's whitelisted roles now are:\n${(h.length > 0) ? h.join("\n") : guild.roles.everyone}`
            }
            await message.channel.send({embed: embed});
        } else if (args[1] == "clear") {
            var updated = await emoji.edit({roles: []});
            var h = updated.roles.cache.map(el => el.toString());
            var embed = {
                author: {
                    name: emoji.name,
                    icon_url: emoji.url
                },
                //title: "lol",
                description: `Updated ${updated}, The emoji's whitelisted roles now are:\n${(h.length > 0) ? h.join("\n") : guild.roles.everyone}`
            }
            await message.channel.send({embed: embed});
        } else if (args[1] == "yeet") {
            if (!emoji) throw "e";
            if (emoji.id == "755546914715336765") throw "Some unknown forces are blocking you from doing that";
            await emoji.delete();
            message.channel.send(`${emoji} was yeeted`);
        } else if (args[0] == "add") {
            var thing = (message.attachments.first() || {}).url || args[1];
            if (!thing) throw "e";
            if (!args[2]) throw "eeeeee";
            var emoji = await guild.emojis.create(thing, args[2])
            message.channel.send(`${emoji}`);
        } else {
            var h = emoji.roles.cache.map(el => el.toString());
            var values = Object.entries(emoji)
            .filter(el => typeof el[1] != 'function' && typeof el[1] != 'object' && el[1].forEach == undefined)
            .map(el => {
                return {
                    name: stuff.thing(el[0]),
                    value: el[1]
                }
            })
            var embed = {
                author: {
                    name: emoji.name,
                    icon_url: emoji.url
                },
                //title: "lol",
                thumbnail: {
                    width: 64,
                    height: 64,
                    url: emoji.url,
                },
                fields: [{
                    name: "Whitelisted Roles",
                    value: ((h.length > 0) ? h.join("\n") : guild.roles.everyone)
                }, ...values],
            }
            await message.channel.send({embed: embed});
        }
    } catch (e) {
        stuff.sendError(message.channel, e)
    }
    GuildEmojiRoleManager
}
var cmd = new RestrictedCommand("emoji", execute, ["MANAGE_EMOJIS"])
cmd.usage = "emoji <emoji name|emoji id> <add|remove|clear|edit> <role|url>"

module.exports = cmd;
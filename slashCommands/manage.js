var { CommandInteraction, ApplicationCommand, Permissions } = require('discord.js')
const stuff = require('../stuff')
module.exports = {
    type: "CHAT_INPUT",
    name: "manage",
    description: "Funi management",
    /**
     * @type {import('discord.js').ApplicationCommandOption[]}
     */
    options: [{
        type: "SUB_COMMAND_GROUP",
        description: "the",
        name: "selfroles",
        options: [
            {
                type: "SUB_COMMAND",
                name: "edit",
                description: "Edit/Add a role",
                options: [
                    {
                        type: "ROLE",
                        name: "role",
                        description: "The role",
                        required: true,
                    },
                    {
                        type: "STRING",
                        name: "description",
                        description: "The new description",
                        required: true,
                    }
                ]
            },
            {
                type: "SUB_COMMAND",
                name: "delete",
                description: "Delete a role",
                options: [
                    {
                        type: "ROLE",
                        name: "role",
                        description: "The role",
                        required: true,
                    },
                ]
            }
        ]
    }],
    /**
     * 
     * @param {CommandInteraction} i 
     */
    async run(i) {
        if (!i.member.permissions.has("MANAGE_ROLES")) throw "no"
        var s = i.options.getSubcommand()
        var role = i.options.getRole("role")
        if (s == "edit") {
            stuff.set(`guilds.${i.guild.id}.selfroles.${role.id}`, { id: role.id, description: i.options.getString("description") })
            await i.reply(`Updated self role ${role.name}`)
        } else if (s == "delete") {
            var e = stuff.getConfig(`guilds.${i.guild.id}.selfroles`)
            if (delete e[role.id]) {
                await i.reply(`Deleted self role ${role.name}`)
            } else await i.reply(`Could not delete self role`)
        }
    }
}
//module.exports.options.push({ type: "STRING", required: true, name: 'json', description: "The" })
const stuff = require("../stuff")

module.exports = {
    name: "roleinfo",
    useArgsObject: true,
    arguments: [
        {
            name: "role",
            type: "role",
            description: 'The role to show info about'
        }
    ],
    execute(message, args) {
        var embed = {
            color: args.role.color,
            title: `${args.role.name} (${args.role.id})`,
            fields: [
                {
                    name: "Permissions",
                    value: args.role.permissions.toArray().map(el => stuff.thing(stuff.snakeToCamel(el.toLowerCase()))).join(', '),
                },
                {
                    name: "Color",
                    value: args.role.hexColor,
                    inline: true,
                },
                {
                    name: "Mentionable",
                    value: args.role.mentionable ? 'Yes' : 'No',
                    inline: true,
                },
                {
                    name: "Managed",
                    value: args.role.managed ? 'Yes' : 'No',
                    inline: true,
                },
                {
                    name: "Created at",
                    value: args.role.createdAt.toString()
                }
            ]
        }
        message.channel.send({embed: embed})
    }
}
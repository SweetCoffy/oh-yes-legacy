var stuff = require('../../stuff')
module.exports = {
    name: "get",
    useArgsObject: true,
    arguments: [
        {
            name: 'filename',
            type: 'string'
        }
    ],
    onExecute(message, args) {
        var h = stuff.loadedContent[args.filename];
        if (!h) throw `Loaded file \`${args.filename}\` doesn't exist`
        var embed = {
            title: `${h.fullName}`,
            fields: [
                {
                    name: "ID",
                    value: h.id,
                },
                {
                    name: "Content Type",
                    value: h.type + `(${stuff.contentTypes[h.type]})`,
                },
                {
                    name: "Name",
                    value: h.content.name || 'Name not specified'
                },
            ]
        }
        message.channel.send({embed: embed})
    }
}
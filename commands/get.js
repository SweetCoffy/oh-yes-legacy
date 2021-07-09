const stuff = require('../stuff');
module.exports = {
    name: "get",
    description: "returns the value of a setting",
    useArgsObject: true,
    arguments: [
        {
            name: "setting",
            type: "string",
        }
    ],
    execute (message, args) {
        var value = stuff.getConfig(args.setting, undefined);
        message.channel.send({content: require('util').inspect(value), code: "js", split: true});
    }
}
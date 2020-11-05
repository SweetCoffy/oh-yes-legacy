const stuff = require("../stuff")

module.exports = {
    name: "userconfig",
    useArgsObject: true,
    arguments: [
        {
            name: "method",
            type: "string",
            validValues: ["get", "set"]
        },
        {
            name: "setting",
            type: "string",
        },
        {
            name: "value",
            type: "any",
            optional: true,
            default: "",
        }
    ],
    execute(message, args) {
        
        if (args.method == "get") {
            var config = stuff.getUserConfig(message.author.id);
            var value = config[args.setting]
            message.channel.send(`**${stuff.thing(args.setting)}**: \`${value}\``);
        } else if (args.method == "set") {
            if (args.value == undefined) throw "***e***"
            var obj = {};
            obj[args.setting] = args.value;
            stuff.setUserConfig(message.author.id, obj);
            message.channel.send(`Set **${stuff.thing(args.setting)}** to \`${args.value.toString()}\``);
        } else {
            throw "e"
        }
    }
}
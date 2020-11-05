module.exports = {
    name: "test",
    arguments: [
        {
            type: "user",
            optional: true,
            default: "me"
        },
        {
            type: "number",
            optional: true,
            default: 0,
        },
        {
            type: "string",
            default: "",
            optional: true
        },
    ],
    execute(message, args, extraArgs, extraArgsObj) {
        message.channel.send(`henlo, arguments passed: [${args}] (${args.map(el => typeof el)}), [${extraArgs}], ${JSON.stringify(extraArgsObj)}`);
    }
}
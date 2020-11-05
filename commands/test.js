module.exports = {
    name: "test",
    useArgsObject: true,
    arguments: [
        {
            name: "testUser",
            type: "user",
            optional: true,
            default: "me"
        },
        {
            name: "testNumber",
            type: "number",
            optional: true,
            default: 0,
        },
        {
            name: "testString",
            type: "string",
            default: "",
            optional: true
        },
    ],
    execute(message, args, extraArgs, extraArgsObj) {
        message.channel.send(`henlo, arguments passed: ${JSON.stringify(args)}, [${extraArgs}], ${JSON.stringify(extraArgsObj)}`);
    }
}
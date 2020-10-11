module.exports = {
    name: "test",

    execute(message, args, extraArgs, extraArgsObj) {
        message.channel.send(`henlo, arguments passed: [${args}], [${extraArgs}], ${JSON.stringify(extraArgsObj)}`);
    }
}
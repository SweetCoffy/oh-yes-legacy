module.exports = {
    name: "test",

    execute(message, args, extraArgs) {
        message.channel.send(`henlo, arguments passed: [${args}], [${extraArgs}]`);
    }
}
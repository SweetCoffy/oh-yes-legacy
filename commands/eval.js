const safeEval = require('../node_modules/safe-eval');

var context = {
    print(str) {
        require('../stuff').client.channels.cache.get('760600288096288789').send(`console output: \`${str}\``);
    },

}

module.exports = {
    name: "eval",
    description: "executes the safeEval function from the [safe-eval](https://www.npmjs.com/package/safe-eval) package",
    usage: "eval <code>",
    requiredPermission: "commands.eval",
    removed: true,

    execute(message, args) {
        
        var code = args.join(" ");
        
        if (!code) {
            throw "e"
        } 

        var timer = setTimeout(() => {
            return message.channel.send("looks like you tried to aboose an exploit lol");
        }, 1000);

        context.client = message.client;
        var result = safeEval(code, context);

        clearTimeout(timer);

        message.channel.send(`The code has been executed and it returned: \`${result}\``);
    }
}
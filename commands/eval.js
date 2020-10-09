const vm2 = require('../node_modules/vm2');

context = {

    h: "h",
    eggs: "yes",
    funnyNumbers: [
        420, 69,
        69420, 42069
    ]
}

module.exports = {
    name: "eval",
    description: "h",
    usage: "eval <code>",
    requiredPermission: "commands.eval",
    removed: false,

    execute(message, args) {
        
        var vm = new vm2.VM({
            timeout: 1000,
            sandbox: context
        })
        
        
        var code = args.join(" ");
        
        if (!code) {
            throw "e"
        } 
                
        var result = vm.run(code);




        message.channel.send(`The code has been executed and it returned: \`${result}\``);
    }
}
const vm2 = require('../node_modules/vm2');


class EvalConsole {
    out = [];
    constructor() {}
    print = function(x) {
        this.out.push(x);
        return this.out.length
    }
    overrideLine = function(line, str) {
        this.out[line] = str;
        return this.out.length
    }
    clear = function() {
        var oldOut = this.out;
        this.out = [];
        return oldOut;
    }
}
const c = new EvalConsole()
const context = {
    h: "h",
    eggs: "yes",
    funnyNumbers: [
        420, 69,
        69420, 42069
    ],
    output: c,
}
var cloneContext = Object.freeze({
    h: "h",
    eggs: "yes",
    funnyNumbers: [
        420, 69,
        69420, 42069
    ],
    output: c,
})


module.exports = {
    name: "eval",
    description: "h",
    usage: "eval <code>",
    requiredPermission: "commands.eval",
    removed: false,

    execute(message, args) {
        
        var vm = new vm2.VM({
            timeout: 1000,
            sandbox: cloneContext
        })
        
        
        var code = args.join(" ");
        
        if (!code) {
            throw "e"
        } 
                
        var result = vm.run(code);

        

        var embed = {
            title: `Code executed succesfully`,
            color: 0x4287f5,
            fields: [
                {
                    name: "input",
                    value: `\`\`\`js\n${code}\n\`\`\``,
                    inline: true,
                },
                {
                    name: "output",
                    value: `\`\`\`js\n${result}\n\`\`\``,
                    inline: true,
                },
            ]
        }

        if (cloneContext.output.out.length > 0) {
            embed.fields.unshift({
                name: "console",
                value: `\`\`\`\n${cloneContext.output.out.join("\n")}\n\`\`\``,
            })
        }
        
        
        message.channel.send({embed: embed})
        cloneContext = context
        cloneContext.output.clear()
    }
}


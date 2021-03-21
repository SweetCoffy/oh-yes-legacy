const vm2 = require('../node_modules/vm2');
const stuff = require('../stuff')


class EvalConsole {
    out = [];
    constructor() {}
    log = function(x) {
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
    auser: "not a duck",
    get console() {
        return c
    },
    get Base64() {
        return require('../Base64')
    },
    format: stuff.format,
    mergeObjects: stuff.mergeObjects,
}
var cloneContext = Object.freeze(context)



module.exports = {
    name: "eval",
    description: "h",
    usage: "eval <code>",
    requiredPermission: "commands.eval",
    removed: false,
    execute(message, args) {
        try {
            var vm = new vm2.VM({
                timeout: 500,
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
                        name: "Input",
                        value: `\`\`\`js\n${code}\n\`\`\``,
                        inline: true,
                    },
                    {
                        name: "Output",
                        value: `\`\`\`js\n${(result ? result : `${result}`).toString().slice(0, 1000)}\n\`\`\``,
                        inline: true,
                    },
                ]
            }
            if (cloneContext.console.out.length > 0) {
                embed.fields.unshift({
                    name: "Console",
                    value: `\`\`\`\n${cloneContext.console.out.join("\n").slice(0, 1000)}\n\`\`\``,
                })
            }
            message.channel.send({embed: embed})
        } catch (e) {
            throw e
        } finally {            
            cloneContext.console.clear()
            cloneContext = context
        }
    }
}


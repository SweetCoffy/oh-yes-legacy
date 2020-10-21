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
class EvalDisplay {
    drawQueue = []
    wasModified = false
    /**
     * big boi array
     */
    entries = []
    setSize(width, height = width) {
        this.entries = [];
        for (var x = 0; x < width; x++) {
            var thing = [];
            for (var y = 0; y < height; y++) {
                thing.push(" ");
            }
            this.entries.push(thing);
        }
    }
    constructor() {}
    getPos(x, y) {
        return this.entries[x][y]
    }
    draw(x, y, char = "◼", autoFlush = true) {
        this.drawQueue.push({
                x: x, 
                y: y, 
                char: char
            })
        if (autoFlush) {
            this.flush();
        }
    }
    drawDiagonal(x, y, length, width = 1, height = 1, char = "◼") {
        for(var i = 0; i < length; i++) {
            this.drawRect(x + i, y + i, width, height, char);
        }
    }
    clear = function() {
        this.setSize(this.entries.length, (this.entries[0] || []).length || this.entries.length)
    }
    drawRect(x, y, width, height, char = '◼') {
        for (var _x = 0; _x < width; _x++) {
            for (var _y = 0; _y < height; _y++) {
                this.draw(x + _x, y + _y, char)
            }
        }
    }
    flush() {
        if (this.entries.length < 1) {
            this.setSize(24, 24)
        }
        for (var i = 0; i < this.drawQueue.length; i++) {
            var el = this.drawQueue.pop();
            this.entries[el.x][el.y] = el.char.slice(0, 1);
        }
        this.wasModified = true;
    }
    toString() {
        var i2 = 0;
        var result = "";
        for (var x = 0; x < this.entries.length; x++) {
            for (var y = 0; y < this.entries[x].length; y++) {
                result += this.entries[x][y]
                i2++
                if (i2 > this.entries.length - 1) {
                    i2 = 0
                    result += "\n"
                };
            }
        }
        return result;
    }
}
class Yes {
    constructor() {}
    getObjectProperties(obj) {
        var keys = Object.keys(obj);
        var result = [];
        var self = this;
        for (const key of keys) {
            if (typeof obj[key] == 'object') {
                var vals = self.getObjectProperties(obj[key])
                for (const k of vals) {
                    result.push([`${key}/${k[0]}/`, obj[key][k]])
                }
            } else {
                result.push([`${key}/`, obj[key]])
            }
        }
        return result;
    }
}
const c = new EvalConsole()
const d = new EvalDisplay();
const y = new Yes();
const m = {
    "output": {
        display: d,
        console: c,
    },
    "other": {
        yes: y,
    }
}
const context = {
    h: "h",
    eggs: "yes",
    funnyNumbers: [
        420, 69,
        69420, 42069
    ],
    get Display() {
        try {
            return this["display"] || this["output"].display
        } catch (_err) {
            return undefined;
        }
    },
    get Console() {
        try {
            return this["console"] || this["output"].console
        } catch (_err) {
            return undefined;
        }
    },
    format: stuff.format,
    i(md) {
        /**
         * @type {string[]}
         */
        var segments = md.split("/");
        var val = m;
        
        for (const segment of segments) {
            var oldVal = val;
            val = oldVal[segment];
            console.log(segment);
        }
        console.log(val);
        return val;
    }
}

var cloneContext = {
    h: "h",
    eggs: "yes",
    get Display() {
        try {
            return this["display"] || this["output"].display
        } catch (_err) {
            return undefined;
        }
    },
    get Console() {
        try {
            return this["console"] || this["output"].console
        } catch (_err) {
            return undefined;
        }
    },
    funnyNumbers: [
        420, 69,
        69420, 42069
    ],
    format: stuff.format,
    i(md) {
        /**
         * @type {string[]}
         */
        var segments = md.split("/");
        var val = m;
        
        for (const segment of segments) {
            var oldVal = val;
            val = oldVal[segment];
            console.log(segment);
        }
        console.log(val);
        return val;
    }

}




module.exports = {
    name: "eval",
    description: "h",
    usage: "eval <code>",
    requiredPermission: "commands.eval",
    removed: false,

    execute(message, args, _extraArgs, extraArgs) {
        
        var vm = new vm2.VM({
            timeout: 2000,
            sandbox: cloneContext
        })
        
        
        var code = args.join(" ");

        if (extraArgs.import) {
            var autoImports = extraArgs.import.split(",").map(el => el.trim())
            autoImports.forEach(el => {
                var h = el.split("/");
                cloneContext[h[h.length - 1]] = cloneContext.i(el)
            })
        }
        
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

        var hasConsole = (cloneContext.console || (cloneContext.output || {}).console)
        var hasDisplay = (cloneContext.display || (cloneContext.output || {}).display)

        if (hasConsole) {
            if (cloneContext.Console.out.length > 0) {
                embed.fields.unshift({
                    name: "console",
                    value: `\`\`\`\n${cloneContext.Console.out.join("\n").slice(0, 1980)}\n\`\`\``,
                })
            }
        }

        if (hasDisplay) {
            if (cloneContext.Display.wasModified) {
                embed.fields.unshift({
                    name: "display",
                    value: `\`\`\`AsciiArt\n${cloneContext.Display.toString()}\n\`\`\``
                })
            }
        }

        
        
        message.channel.send({embed: embed})
        if (hasConsole) cloneContext.Console.clear()
        if (hasDisplay) cloneContext.Display.clear();
        cloneContext = context
    }
}


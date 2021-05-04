var { inspect } = require('util')
var stuff = require('../stuff')
const docs = {
    concat: {
        description: "Joins the inputs together, can also be used to add numbers together",
        type: "function",
        args: [{ name: "...args", type: "string" }]
    },
    call: {
        description: "Calls `func` with user defined arguments",
        type: "function",
        args: [{ name: "func", type: "function" }, { name: "args", type: "array" }]
    },
    get: {
        description: "Gets `key` from `object`",
        type: "function",
        args: [{ name: "object", type: "object" }, { name: "key", type: "string" }]
    },
    parseExpression: {
        description: "Runs the `parseExpression` function used in eggscript and returns the result",
        type: "function",
        args: [{ name: "expr", type: "string" }]
    },
    class: {
        description: "Creates a new class",
        type: "function",
        args: [{ name: "name", type: "string" }, { name: "constructor", type: "function" }, { name: "prototype", type: "object" }]
    },
    new: {
        description: "Creates an instance of \`class\`",
        type: "function",
        args: [{ name: "class", type: "class" }, { name: "...args", type: "array" }]
    },
    'return': {
        type: "keyword",
        displayName: `return <value> [if <condition> [else <secondValue>]]`,
        description: `Returns out of the function with \`value\`, if \`if\` is added this will only return when \`condition\` is true and if \`else\` is added it will return \`secondValue\` when the condition isn't met`
    },
    'while': {
        type: "keyword",
        displayName: `while <condition> : <code>`,
        description: `Runs \`code\` until \`condition\` is false`
    }
}
require('../stuff').docs = docs;
module.exports = {
    name: "eggscript",
    description: "Run some eggscript code",
    useArgsObject: true,
    category: "eggscript",
    arguments: [
        {
            name: "text",
            type: "string"
        }
    ],
    cooldown: 5,
    execute(message, args) {
        var t = args.text;
        var val = stuff.eggscript(t);
        message.channel.send({ content: inspect(val), code: 'js', split: true, })
    }
}
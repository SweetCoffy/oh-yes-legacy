var { inspect } = require('util')
var stuff = require('../stuff')
var Discord = require('discord.js')
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
    /**
     * 
     * @param {Discord.Message} message 
     * @param {{text: string}} args 
     */
    async execute(message, args) {
        var code = args.text;
        var builtinMds = {
            'the_void': {
                operators: [
                    {
                        sign: "+",
                        run(a, b) {
                            return a + b;
                        }
                    },
                    {
                        sign: "-",
                        run(a, b) {
                            return a - b;
                        }
                    },
                    {
                        sign: "<<",
                        run(a, b) {
                            if (typeof a.then == "function") {
                                return a.then((...a) => b(...a))
                            } else if (Array.isArray(a)) {
                                return a.push(b)
                            } else if (typeof a.write == "function") {
                                a.write(b);
                                return null;
                            }
                        }
                    },
                    {
                        sign: ">>",
                        run(a, b) {
                            if (Array.isArray(a) && Array.isArray(b)) return b.push(a.pop());
                            else if (Array.isArray(a) && typeof b == "function") a.forEach(b);
                            else if (Array.isArray(a)) return globalContext[b] = a.pop();
                        } 
                    }
                ]
            }
        }
        var globalContext = {
            print: (text) => {
                message.channel.send(`${text}`)
            },
            stdin: process.stdin,
            stdout: process.stdout,
            stderr: process.stderr,
            createArray(...args) {
                var a = [];
                for (var ar of args) {
                    a.push(ar);
                }
                return a;
            },
            set(o, k, v) {
                return o[k] = v;
            },
            get input() {
                return new Promise(async(resolve) => {
                    await message.channel.send(`${message.author} Enter your input`)
                    var m = (await message.channel.awaitMessages((m) => m.author.id == message.author.id, { time: 1000 * 60, max: 1 })).first();
                    console.log(m)
                    return resolve(parseExpression(m.content))
                })
            },
            get import() {
                return builtinMds.the_void.import;
            },
            get true() {
                return true;
            },
            get false() {
                return false;
            },
            get null() {
                return null;
            },
            get undefined() {
                return undefined;
            },
            get random() {
                return Math.random();
            },
            test: {
                nesting: {
                    go: {
                        brr: "BRRRR"
                    }
                }
            },
        }
        builtinMds.the_void.import = function (md = "") {
            var h1 = md.split('/').reduce((prev, cur) => {
                return prev?.[cur];
            }, builtinMds);
            if (h1) return h1;
            if (!h1 && md.split(".").length < 2) md += ".eggs";
            if (!require('fs').existsSync(require("path").resolve(md))) return null;
            run(require('fs').readFileSync(require("path").resolve(md), "utf8"), {});
            var exports = globalContext.EXPORTS;
            globalContext.EXPORTS = undefined;
            return exports;
        }
        function getVar(name = "", context = {}) {
            var h1 = name.split(".").reduce((prev, cur) => {
                return prev?.[cur];
            }, context);
            var h2 = name.split(".").reduce((prev, cur) => {
                return prev?.[cur];
            }, globalContext);
            return h1 ?? h2;
        }
        function setVar(isGlobal = false, name = "", value, context = {}) {
            var h = isGlobal ? globalContext : context;
            name.split(".").reduce((prev, cur, i, ar) => {
                if (i < (ar.length - 1)) {
                    return prev[cur];
                } 
                prev[cur] = value;
            }, h)
            return value;
        }
        function debug(str) {
            if (globalContext.DEBUG == true) {
                if (typeof str == "object") str = require('util').inspect(str, true, 1, true)
                globalContext.print(`[DEBUG] ${str}`)
            }
        }
        async function parseExpression(exp = "", context = {}) {
            debug(`'${exp}'`)
            exp = exp.trimStart();
            var functionRegex = /^\s*(\w+)\s+function\s+([\w,]+)\s*\((.*?)\)\s*\{(.*)\}/s
            var functionCall = /^\s*([\w.]+?)\((.*)\)/
            var fn = exp.match(functionRegex)
            var call = exp.match(functionCall)
            var op;
            var operators = builtinMds.the_void.operators;
            for (var operator of operators) {
                if (exp.split(operator.sign).length > 1) {
                    op = operator;
                    break;
                }
            }
            if (fn) {
                var type = (fn[1] || "");
                var name = (fn[2] || "");
                var argn = (fn[3] || "").split(",").map(el => el.trim());
                var body = (fn[4] || "");
                debug(`Function declaration: '${type}', '${name}', [${argn}], '${body}'`)
                return setVar(type == "global", name, function(...args) {
                    var ctx = {};
                    for (var i = 0; i < argn.length; i++) {
                        ctx[argn[i]] = args[i];
                    }
                    return run(body, ctx);
                }, context)
            } else if (call) {
                var func = parseExpression(call[1], context);
                var args = call[2].split(",").map(el => parseExpression(el.trim(), context));
                debug(`Function call: '${call[1]}', [${args.map(el => "'" + el + "'")}]`)
                args = await Promise.all(args)
                return await ((await func)(...args));
            } else if (exp.startsWith("global ")) {
                var h = exp.slice("global ".length).split("=");
                var name = h[0].trim();
                var value = parseExpression(h.slice(1).join("="));
                setVar(true, name, await value, context);
                return value;
            } else if (exp.startsWith("local ")) {
                var h = exp.slice("global ".length).split("=");
                var name = h[0].trim();
                var value = parseExpression(h.slice(1).join("="));
                setVar(false, name, await value, context);
                return value;
            } else if (op) {
                var h = exp.split(op.sign);
                var left = h[0].trim();
                var right = h.slice(1).join(op.sign).trim();
                debug(left + ", " + right)
                return op.run(parseExpression(left), parseExpression(right))
            } else if (exp.startsWith("\"") && exp.endsWith("\"")) {
                return exp.slice(1, exp.length - 1);
            } else if (exp.startsWith("{") && exp.endsWith("}")) {
                var h_ = exp.slice(1, exp.length - 1);
                var h = h_.split(/(?<!{[^\n}]),(?![^\n{]})/gs).map(el => el.trim().split("="));
                var obj = {};
                for (var [k, ...e] of h) {
                    obj[parseExpression(k.trim())] = parseExpression(e.join("=").trim());
                }
                return obj;
            } else if (exp.startsWith("`") && exp.endsWith("`")) {
                var regex = /\$\{(.+?)\}/g
                var result = exp.slice(1, exp.length - 1).replace(regex, (substr, expr) => {
                    return parseExpression(expr, context);
                })
                return result;
            } else if (!Number.isNaN(Number(exp))) {
                return Number(exp);
            } else return getVar(exp, context);
        }
        async function run(code = "", context = {}) {
            var splitter = /(?<![{"\[\`][^}\]]*)(?:;|\n)(?![^{\[\S]*[\]"}\`])|END/gs;
            var lines = code.split(splitter);
            debug(lines)
            var last;
            for (var i = 0; i < lines.length; i++) {
                last = await parseExpression(lines[i], context);
            }
            return last;
        }
        var val = await run(code);
        message.channel.send({ content: inspect(val), code: 'js', split: true, })
    }
}
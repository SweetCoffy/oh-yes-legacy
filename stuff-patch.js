// File used to replace things in stuff.js without needing a bot restart
var stuff = require('./stuff.js')
module.exports = {
    bar(v, max, w, options) {
        var opts = { fill: ["▒", "▓", "█"], padding: " ", showText: false }
        for (var p in options) {
            opts[p] = options[p]
        }
        var val = v;
        v = v % (max + 0.01)
        var { fill, padding, showText } = opts;
        var bar = ""
        var v = (v / max) * w;
        for (;v > 0; v--) {
            var idx = Math.floor(Math.max(Math.min(v, 0.999), 0) * fill.length)
            var c = fill[idx]
            bar += c
        }
        while (bar.length < w) {
            bar += padding
        } 
        return bar + (showText ? ` ${stuff.format(val)}/${stuff.format(max)}` : "")
    },
    test: "the j",
    getInventory(user) {
        var s = stuff
        return s.db.getData(` /${user}/inventory`)
    },
    itemP(id, amt = 1, noIcon = false) {
        var i = stuff.shopItems[id]
        return `${(amt != 1) ? `${amt}x ` : ''}${!noIcon ? `${i.icon} ` : ""}${i.name}`
    },
    eggscript(str, context = {}) {
            var variables = { define(name, value) { variables[name] = value }, 
            concat(...args) { return args.reduce((prev, cur) => prev + cur) }, 
            call(func, args) {
                return func(...args);
            },
            info(thing) {
                return docs[thing]
            },
            String: String,
            Number: Number,
            array() { return [] },
            createObject() { return {} }, set(object, key, value) { object[key] = value; return object }, 
            get(object, key) { return object[key] },
            ['function'](code) {
                console.log(code)
                var newCode = code.replace(/\\n/g, "\n")
                return (...args) => {
                    variables.args = [];
                    for(var arg of args) {
                        variables.args.push(arg)
                    }
                    var result = parser(newCode)
                    variables.args = [];
                    return result;
                }
            },
            eval(code) {
                return parser(code.replace(/\\n/g, "\n"));
            },
            parseExpression(expr) {
                return parseExpression(expr);
            },
            callTimes(func, ...args) {
                var vals = []
                for (var a of args) {
                    vals.push(func(...a))
                }
                return vals;
            },
            apply(object, func, args) {
                return func.apply(object, args)
            },
            new(c, ...args) {
                return new c(...args);
            },
            ['class'](name, cons, props) {
                var c = class Placeholder {
                    constructor(...args) {
                        var t = this;
                        cons(t, ...args);
                    }
                }
                c.prototype = props;
                return variables[name] = c; 
            },
            ['undefined']: undefined,
            ['null']: null,
            ['NaN']: NaN,
            ['true']: true,
            ['false']: false,
            ['require'](m) {
                if (message.author.id != '602651056320675840') return undefined;
                return require(m)
            },
            Math: Math,
            operators: {
                call(name, left, right) {
                    return variables.operators[name]({value: left}, {value: right})
                },
                '+': (a, b) => a.value + b.value,
                '=': (a, b) => a.parent[a.key] = b.value,
                '%': (a, b) => a.value % b.value,
                '/': (a, b) => a.value / b.value,
                "!=": (a, b) => a.value != b.value,
                "==": (a, b) => a.value == b.value,
                '*': (a, b) => {
                    if (typeof a.value == 'string') {
                        return a.value.repeat(b.value)
                    } else {
                        return a.value * b.value;
                    }
                }
            }
        }
        variables = {...variables, ...context}
        variables['this'] = variables;
        var commaSplitRegex = /(?<![\[\{\(][^\]\[]*),(?![^\]\[]*[\]\}\)])/g;
        function parseExpression(str, om = false) {
            str = str.trim();
            if (str.length <= 0) return undefined;
            var num = Number(str);
            var m = str.match(/^([\w\.]+?)\((.*)\)/)
            var o = str.match(/^([^"]+?)([+=*%!/]{1,2})([^"]+)/)
            console.log(`parsing: ${str}`)
            if (isNaN(num)) {
                if (str.startsWith('"') && str.endsWith('"')) {
                    console.log(`parsing string`)
                    return om ? {value: str.substring(1, str.length - 1)} : str.substring(1, str.length - 1);
                } else if (str.startsWith('{') && str.endsWith('}')) {
                    console.log(`parsing object`)
                    var obj = {}
                    var s = str.substring(1, str.length - 1).split(commaSplitRegex)
                    for (var seg of s) {
                        var p = seg.split(":")
                        var k = parseExpression(p[0]);
                        var v = parseExpression(p.slice(1).join(":"))
                        if (!k) continue;
                        obj[k] = v;
                    }
                    return om ? {value: obj} : obj
                } else if (str.startsWith("[") && str.endsWith("]")) {
                    console.log(`parsing array literal`)
                    var s = str.substring(1, str.length - 1);
                    var e = s.split(commaSplitRegex).map(el => parseExpression(el));
                    return e;
                } else if (str.startsWith("(") && str.endsWith(")")) {
                    console.log(`parsing parentehssdfgoihnesri9fu stuff`)
                    return parseExpression(str.substring(1, str.length - 1))
                } else if (m) {
                    console.log(`parsing function call: ${m[1]}(${m[2]})`)
                    var func = parseExpression(m[1]);
                    if (typeof func != 'function') throw new TypeError(`${m[1]} is not a function`)
                    var args = m[2].split(commaSplitRegex).map(el => parseExpression(el.trimEnd().trimStart()))
                    variables.args = args;
                    var r = func(...args)
                    variables.args = undefined;
                    console.log(`function result: ${r}`)
                    return om ? {value: func(...args)} : func(...args);
                } else if (o) {
                    console.log(`parsing operator`)
                    var a = parseExpression(o[1], true);
                    var op = o[2];
                    var b = parseExpression(o[3], true);
                    var operator = variables.operators[op];
                    if (!operator) throw `Invalid operator`
                    return om ? {value: operator(a, b)} : operator(a, b);
                } else {
                    console.log(`parsing variable`)
                    var parent = variables
                    var lastKey = ''
                    var val = str.split('.').reduce((prev, cur, i, ar) => { if(i != ar.length - 1) parent = prev; lastKey = cur; return prev && prev[cur] }, variables);
                    console.log(val)
                    if (!om) return val;
                    else return { value: val, parent, key: lastKey }
                }
            } else return om ? { value: num } : num;
        }
        var parserInstructionSplitRegex = /;\n(?!.*")/gs;
        var parseCounter = 0;
        function parser(str) {
            parseCounter++;
            var tokens = ""
            var ignore = ['\t']
            if (parseCounter > 100) throw `Parser call limit reached`
            for (var i = 0; i < str.length; i++) {
                var c = str[i];
                if (ignore.includes(c)) continue;
                tokens += c;
            }
            var ins = tokens.split(parserInstructionSplitRegex)
            var last;
            var returnValue = undefined;
            for (var i = 0; i < ins.length; i++) {
                var l = ins[i];
                if (!l) continue;
                if (l.startsWith("return")) {
                    var v = l.slice("return".length);
                    var h = v.split("if");
                    if (h.length > 1) {
                        var r = parseExpression(h[0]);
                        var e = h[1].split("else");
                        var c = parseExpression(e[0]);
                        if (c) {
                            returnValue = r;
                            break;
                        } else if (e[1]) {
                            returnValue = parseExpression(e[1])
                            break;
                        }
                    } else {
                        returnValue = parseExpression(v);
                        break;
                    }
                } else if (l.startsWith("while")) {
                    var h = l.slice("while".length).split(":")
                    var cond = h[0];
                    var code = parseExpression(h.slice(1).join(":"));
                    while (parseExpression(cond)) {
                        parser(code);
                    }
                    continue;
                }
                last = parseExpression(l);
            }
            return returnValue;
        }
        return parser(str);
    },
    getUserData(user) {
        var s = stuff;
        var o = {
            /**
             * @type {[key: string]: BigInt}
             */
            money: {},
            /**
             * @type {number}
             */
            get attack() {
                return s.getAttack(user)
            },
            set attack(v) {
                return s.db.data[user].attack = v;
            },
            /**
             * @type {number}
             */
            get defense() {
                return s.getDefense(user)
            },
            set defense(v) {
                return s.db.data[user].defense = v;
            },
            /**
             * @type {number}
             */
            get speed() {
                return s.getSpeed(user)
            },
            set speed(v) {
                return s.db.data[user].speed = v;
            },
            /**
             * @type {number}
             */
            get xp() {
                return s.getXP(user)
            },
            set xp(v) {
                return s.db.data[user].xp = v;
            },
            /**
             * @type {number}
             */
            get levelUpXP() {
                return s.getLevelUpXP(user)
            },
            set levelUpXP(v) {
                return s.db.data[user].levelUpXP = v;
            },
            /**
             * @type {number}
             */
            get level() {
                return s.getLevel(user)
            },
            set level(v) {
                return s.db.data[user].level = v;
            },
            /**
             * @type {number}
             */
            get multiplier() {
                return s.getMultiplier(user)
            },
            set multiplier(v) {
                return s.db.data[user].multiplier = v;
            },
            /**
             * @type {number}
             */
            get exponent() {
                return s.getMultiplierMultiplier(user)
            },
            set exponent(v) {
                return s.db.data[user].multiplierMultiplier = v;
            },
            /**
             * @type {number}
             */
            get tetrative() {
                return s.getTetrative(user)
            },
            set tetrative(v) {
                return s.db.data[user].tetrative = v;
            },
            /**
             * @type {number}
             */
            get maxHealth() {
                return s.getMaxHealth(user)
            },
            set maxHealth(v) {
                return s.db.data[user].maxHealth = v;
            },
            /**
             * @type {number}
             */
            get totalMultiplier() {
                return this.multiplier * (this.exponent * this.tetrative)
            }
        }
        for (let c in s._currencies) {
            let val = s._currencies[c]
            Object.defineProperty(o.money, c, { get() {
                return s.getMoney(user, c)
            }, set(v) { stuff.db.data[user][val.propertyName] = BigInt(v) + "" }, configurable: true, enumerable: true })
        }
        return o
    },
    funiTime(time = 0) {
        var ms = time % 1000;
        var s = Math.floor(time / 1000)
        var m = Math.floor(s / 60)
        var h = Math.floor(m / 60)
        m %= 60;
        s %= 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().slice(0, 2).padStart(2, "0")}`
    },
}
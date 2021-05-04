const { Collection, Client, MessageAttachment, User } = require('discord.js');
const fs = require('fs');
const { resolve } = require('path');
const request = require('request');
const jsonDb = require('node-json-db');
const stuff = require('./stuff')
const CommandError = require('./CommandError');
var numeral = require('numeral');

const formatThings = {
    "config": function(args) {
        return require('./stuff').getConfig(args[0]);
    },
    "repeat": function(args) {
        return args[0].repeat(parseInt(args[1]));
    },
    "emoji": function(args, message) {
        var result = message.client.emojis.cache.filter((v, k) => {
            return v.name == args[0] || v.id == args[0];
        }).first()
        return `${result}`
    },
    "getData": function(args) {
        return JSON.stringify(require('./stuff').dataStuff.getData(args[0]), null, 4);
    },
    "bold": function(args) {
        return "**" + args[0] + "**"
    },
    "q": function() {
        return "'"
    },
    "pingnt": function([str]) {
        return `@${str}`
    },
    "charcode": function([code]) {
        return String.fromCharCode(parseInt(code));
    },
    "mult": ([a, b]) => parseFloat(a) * parseFloat(b),
    "add": ([a, b]) => parseFloat(a) + parseFloat(b),
    "div": ([a, b]) => parseFloat(a) / parseFloat(b),
    "subs": ([a, b]) => parseFloat(a) - parseFloat(b),
}
const axios = require('axios')
const Rarity = {
    gray: 0x5d6c85,
    white: 0xedf0f5,
    green: 0x67d95f,
    blue: 0x3f75cc,
    red: 0xed2d1f, // it's actually not red but shut
    pink: 0xff78ff, // totally not copying terraria
    purple: 0xf403fc, // eggs
    yellow: 0xfff947,
}



// extra stuff script


module.exports = {
    somehugenumber: 99999999,
    /**
     * @type Client
     */
    client: undefined,
    doThing(number) {
        var coolCounter = 0;
        var str = number.toString().split("").reverse().join("");
        var res = "";
        for (var i = 0; i < str.length; i++) {
            res += str[i];
            coolCounter++;
            if (coolCounter >= 3) {
                res += " ";
                coolCounter = 0;
            }
        }
        return res.split("").reverse().join("").trim();
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
    rarity: Rarity,
    db: new jsonDb.JsonDB("userdata", false, false, "/"),
    dataStuff: new jsonDb.JsonDB("datastuff", true, true, "/"),
    roles: new jsonDb.JsonDB('roleperms.json', true, true, "/"),
    facts: new jsonDb.JsonDB('funfacts.json', true, true, "/"),
    phoneCommands: new Collection(),
    originalPrices: {},
    cheats: {},
    eastereggs: {},
    eggscriptInstructions: {},
    stonks: {},
    formatThings: formatThings,
    taxes: {
        existing: {
            name: "Existing",
            amount: 100,
            multiplierEffect: 0.5,
        },
        omegaStonks: {
            name: "Omega Stonks",
            amount: 100,
            multiplierEffect: 1.5,
        }
    },
    fighting: {},
    funnyNumbers: [
        69,
        420
    ],
    get counter() {
        var h = parseInt(fs.readFileSync("counter.txt", 'utf8'))
        return h;
    },
    set counter(value) {
        if (value == NaN) return;
        fs.writeFileSync("counter.txt", value.toString())
    },
    rolePermissions(role) {
        var h = this.roles;
        if (!h.exists(`/${role}/permissions`)) h.push(`/${role}/permissions`, [])
        return h.getData(`/${role}/permissions`)
    },
    addTax(user, tax) {
        var h = this.getTaxes(user);
        var t = this.taxes[tax];
        if (h.map(el => el.id).includes(tax)) return;
        h.push({id: tax, ...t})
        this.db.push(`/${user}/taxes`, h)
    },
    getTaxes(user) {
        return this.db.getData(`/${user}/`).taxes || [];
    },  
    writePhoneFile(user, slot, name, content) {
        if (!name) throw `File name must not be empty`
        content = (content + "")
        name = (name + "").slice(0, 32)
        var size = content.length * 2;
        var data = this.db.getData(`/${user}/inventory[${slot}]/extraData/`)
        if (!data.files[name]) {
            if (data.used + size > data.capacity) {
                throw `No space available`
            }
            data.files[name] = content
            data.used += size
        } else {
            if ((data.used - data.files[name].length) + size > data.capacity) {
                throw `No space available`
            }
            data.used -= data.files[name].length
            data.files[name] = content
            data.used += size
        }
        this.db.push(`/${user}/inventory[${slot}]/extraData/`, data)
    },
    deletePhoneFile(user, slot, name) {
        var data = this.db.getData(`/${user}/inventory[${slot}]/extraData/`)
        if (!data.files[name]) throw `File does not exist`
        data.used -= data.files[name].length * 2
        delete data.files[name]
        this.db.push(`/${user}/inventory[${slot}]/extraData/`, data)
    },
    readPhoneFile(user, slot, name) {
        var data = this.db.getData(`/${user}/inventory[${slot}]/extraData/`)
        if (!data.files[name]) throw `File doesn't exist`
        return data.files[name]
    },
    /**
     * Calculates the rank value for the user
     * @param {string | object} user The user object / user id to caculate it's rank value
     */
    getRankValue: user => {
        var stuff = require('./stuff')
        if (typeof user != 'object') user = stuff.db.getData(`/${user}/`)  
        return BigInt(stuff.clamp(Math.floor((Number(user.points) || 0) + ((Number(user.gold) || 0) * 100) + (user.multiplierMultiplier || 1)), 0, Number.MAX_VALUE) || 0)
    },
    /**
     * 
     * @param {Function<String, Object>} callback 
     */
    forEachUser(callback) {
        var users = Object.entries(this.db.getData(`/`))
        users.forEach(([k, v]) => callback(k, v))
    },
    snakeToCamel: (str) => str.replace(
        /([-_][a-z])/g,
        (group) => group.toUpperCase()
                        .replace('-', '')
                        .replace('_', '')
    ),
    getVCounter(user) {
        return this.db.getData(`/${user}/`).vCounter || 0;
    },
    addVCounter(user, amount) {
        this.db.push(`/${user}/vCounter`, this.getVCounter(user) + amount);
    },
    isHtml: str => /<\/?[a-z][\s\S]*>/i.test(str),
    isJson: str => {
        var r = false;
        try {
            JSON.parse(str);
            r = true;
        } catch(_e) {
            r = false;
        }
        return r;
    },

    define(word, sorting = "mostvotes") {
        return new Promise((resolve, reject) => {
            axios.default.get(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`).then(value => {
                var res = value.data.list[0];
                if (sorting == "leastvotes") {
                    res = value.data.list.sort((a, b) => (a.thumbs_up - a.thumbs_down) - (b.thumbs_up - b.thumbs_down))[0]
                } else if (sorting = "mostvotes") {
                    res = value.data.list.sort((a, b) => (b.thumbs_up - b.thumbs_down) - (a.thumbs_up - a.thumbs_down))[0]
                }
                // 
                if (res == undefined) {
                    reject(new CommandError("Definition not found", `Could not find a definitition for \`${word}\``));
                } else {
                    resolve(res);
                }
            }).catch(err => reject(err));
        })
    },

    /**
     * 
     * @param {string} str 
     */
    uFormat(str) {
        var regex = /\[([^\[\]]+)\]/g
        var matches = str.matchAll(regex)
        var result = str;
        for (const match of matches) {
            result = result.replace(match[0], `[${match[1]}](https://www.urbandictionary.com/define.php?term=${encodeURIComponent(match[1])})`)
        }
        return result;
    },
    getUserConfig(user) {
        var config = this.db.getData(`/${user}/`).config || {};
        return config;
    },
    setUserConfig(user, obj) {
        this.db.push(`/${user}/config`, this.mergeObjects(obj, this.getUserConfig(user)))
    },
    mergeObjects(a, b) {
        var _b = Object.create(b);
        Object.keys(a).forEach(el => {
            _b[el] = a[el];
        })
        return _b;
    },

    formatThings: formatThings,

    recentPhoneVer: {
        number: 1.6,
        name: "1.6b",
        updateDuration: 1500
    },

    userHealth: {

    },

    medals: {
        "ve-mode": {
            name: "Venezuela Mode",
            id: "ve-mode",
            icon: ":flag_ve:",
            description: "You triggered venezuela mode"
        },
        "omega-stonks": {
            name: "Omega Stonks",
            id: "omega-stonks",
            description: "You're rich lol",
            icon: '<:ip:770418561193607169>',
        },
        "gold-stonks": {
            name: "Gold Stonks",
            id: "gold-stonks",
            description: "You comitted prestige lol",
            icon: ':coin:',
        },
        "eggflag": {
            name: "Egg flag",
            id: "eggflag",
            description: "You're a gud boi",
            icon: "<:eggflag:779124272832053319>"
        },
        "sun-stonks": {
            name: "The Fucking Sun:tm: Stonks",
            id: "sun-stonks",
            icon: "<:thefukinsun:819716692602781696>",
            description: `You decided to ascend into the 69th dimension`
        },
        "galaxy-stonks": {
            name: "Cheesy Way Stonks",
            id: "galaxy-stonks",
            icon: "🌌",
            description: `You decided to do a thing in the 420th dimension`
        }
    },

    currentBoss: undefined,

    

    existencePrice: 4000,

    validPackages: [
        "eggs",
        "h"
    ],

    writeItemData(user, slot, data) {
        if (typeof data != 'object') return;
        var d = this.readItemData(user, slot);
        Object.keys(data).forEach(k => {
            d[k] = data[k]
        });
        this.db.push(`/${user}/inventory[${slot}]/extraData`, d);
    },
    readItemData(user, slot) {
        var item = Object.create(this.getInventory(user)[slot]);
        if (!item) return {};
        return item.extraData || {};
    },
    setItemProperty(user, slot, k, v) {
        this.db.push(`/${user}/inventory[${slot}]/extraData/${k}`, v);
    },
    getAttack(user) {
        return this.db.getData(`/${user}/`).attack || 1;
    },
    addAttack(user, amount) {
        if (isNaN(amount)) return;
        this.db.push(`/${user}/attack`, this.getAttack(user) + amount)
    },
    getItemProperty(user, slot, k) {
        return (this.db.getData(`/${user}/inventory[${slot}]/`).extraData || {})[k];
    },
    getEmoji(id) {
        return this.dataStuff.getData(`/`).emoji[id] || { id, uses: 0 };
    },
    addEmojiUse(id) {
        var e = this.getEmoji(id)
        e.uses = (e.uses || 0) + 1;
        e.id = id;
        this.dataStuff.push(`/emoji/${id}/`, e)
    },
    mineables: {
        rock: {
            id: "rock",
            chance: 1,
            minAmount: 3,
            maxAmount: 50,
            miningPower: 1,
        },
        copper: {
            id: "copper",
            chance: 0.9,
            minAmount: 1,
            maxAmount: 10,
            miningPower: 1,
        },
        titanium: {
            id: "titanium",
            chance: 0.6,
            minAmount: 1,
            maxAmount: 7,
            miningPower: 2,
        }
    },
    fishes: {

    },
    other: {

    },
    enemies: {

    },
    contentTypes: {
        "item": "shopItems",
        "ore": "mineables",
        "recipe": "craftables",
        "cheat": "cheats",
        "easteregg": "eastereggs",
        "type": "conversions",
        "other": "other",
        "selfRole": 'selfRoles',
        "contentType": "contentTypes",
        "fish": "fishes",
        "instruction": "eggscriptInstructions",
        "enemy": "enemies",
    },
    loadedContent: {},
    loadContent(dir = "content/") {
        var files = fs.readdirSync(dir)
        var regex = /(\w+)\.(.*)\..*/gm
        var contentTypes = this.contentTypes
        for (const file of files) {
            console.log(`Trying to load ${file}`)
            if (fs.statSync(dir + file).isDirectory()) {
                console.log(`Loading ${file} as a folder`)
                this.loadContent(dir + file + "/")
                continue
            }
            var s = file.split(".")
            var match = [file, ...s]
            if (!match[1]) {console.log(`Could not find the content type of ${file}`);continue}
            if (!contentTypes[match[1]]) {console.log(`${file} has an invalid content type`);continue}
            delete require.cache[resolve(dir + match[0])]
            var content = require("./" + dir + match[0])
            this.loadedContent[match[0]] = { id: match[2], type: match[1], fullName: match[0], content, enabled: true }
            console.log(`Loaded ${file} as '${match[1]}' with id of '${match[2]}'`)
        }
    },
    updateContent() {
        var contentTypes = this.contentTypes
        var entries = Object.entries(this.loadedContent)
        for (const [k, v] of entries) {
            if (v.type == "item") this.originalPrices[v.id] = v.content.price
            if (v.enabled) {
                this[contentTypes[v.type]][v.id] = v.content
            } else {
                delete this[contentTypes[v.type]][v.id]
            }
        }
    },
    listProperties(test) {
        var hh = (h, _h = "") => {var list = [];Object.getOwnPropertyNames(h).forEach(el => {if (typeof h[el] == 'object') {var o = h[el];var e = hh(o, _h ? `${_h}/${el}` : `${el}`);list.push(...e);return;};if (el == "token") return;list.push(`${_h ? `${_h}/` : ''}${el}: ${(typeof h[el] == "string") ? `"${h[el]}"` : `${h[el]}`} `)});return list;};
        return hh(test).join('\n')
    },
    randomString(length = 5, characterSet = "abcdefghijklmnopqrswxyz", capitalizeChance = 0.5) {
        var characters = characterSet;
        var generated = "";
        for(var i = 0; i < length; i++) {
            var c = characters[Math.floor(Math.random() * characters.length)];
            if (Math.random() < capitalizeChance) {
                c = c.toUpperCase();
            }
            generated += c;
        }
        return generated;
    },
    getGold(user) {
        return BigInt(parseInt(this.db.getData(`/${user}/`).gold) || 0)
    },
    addFunFact(author, content, imageURL = '') {
        this.facts.push(`/funFacts[]`, {author, content, imageURL, created: Date.now()})
    },
    get funFact() {
        var facts = this.facts.getData(`/funFacts`)
        return facts[Math.floor(Math.random() * facts.length)]
    },
    addGold(user, amount) {
        if (!amount) return;
        if (typeof amount != "bigint") amount = BigInt(Math.floor(amount)) || 0
        this.db.push(`/${user}/gold`, (this.getGold(user) + amount).toString())
        if (amount > 0) {
            this.addAchievement(user, {
                id: "stonks:gold",
                name: "Gold Stonks",
                rarity: Rarity.red,
                description: `<@${user}> Got their first ${this.format(amount)} :coin: <:oO:749319330503852084>`
            })
        }
    },

    /**
     * Capitalizes the first letter of `str` and returns it
     * @param {string} str 
     * @returns {string} Capitalized `str`
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Adds spaces between capitalization and capitalizes the first letter of `str`
     * @param {string} str 
     */
    thing(str) {
        var regex = /([A-Z])/g
        return this.capitalize(str.replace(regex, " $1"));
    },


    craftables: {
        "router-alloy": {
            id: "router-alloy",
            ingredients: [
                {
                    id: "rock",
                    amount: 50
                },
                {
                    id: "copper",
                    amount: 10
                }
            ]
        },
        "copper-pickaxe": {
            id: "copper-pickaxe",
            ingredients: [
                {id: "copper", amount: 40},
                {id: "rock", amount: 10}
            ]
        },
        "titanium-pickaxe": {
            id: "titanium-pickaxe",
            ingredients: [
                {id: "titanium", amount: 30},
                {id: "copper", amount: 10},
                {id: "rock", amount: 15}
            ]
        },
    },

    getDefense(user) {
        return this.clamp(this.db.getData(`/${user}/`).defense || 0, -50, Infinity);
    },

    addDefense(user, amount) {
        var a = amount || 0;
        this.db.push(`/${user}/defense`, this.getDefense(user) + a)
    },
    canCraft(item, user) {
        var items = this.getInventory(user);
        var craftables = this.craftables;
        var inv = {}
        var it = craftables[item];
        items.forEach(el => {
            if (!inv[el.id]) inv[el.id] = {amount: 0, ...el}
            inv[el.id].amount++;
        });
        
        var hasItems = true;
        for (const el of it.ingredients) {
            var h = inv[el.id] || {amount: 0};
            
            
            if (h.amount < el.amount) hasItems = false;
        }
        return hasItems;
    },

    addMedal(user, medal) {
        var db = this.db;
        if ((db.getData(`/${user}/`).medals || []).map(el => el.id).includes(medal.id)) return
        if (!db.exists(`/${user}/medals`)) db.push(`/${user}/medals`, [])
        db.push(`/${user}/medals[]`, medal)
    },

    stringThing(str, message) {
        var formatThings = this.formatThings;
        var regex = /<(\w+)>(.*)<\/\1>|<(\w+)\/>/gms;
        var matches = str.matchAll(regex);
        var s = this;

        
        for (const _match of matches) {
            var match = _match.filter(el => el != '' && el != undefined);
            if (formatThings[match[1]] == undefined) continue;
            var replaceStr = "";
            try {
                replaceStr = formatThings[match[1]](match[2].split(",").map(v => s.stringThing(v.trimStart(), message)), message);
            } catch (err) {
                replaceStr = err.toString();
            }
            str = str.replace(/<(\w+)>(.*)<\/\1>|<(\w+)\/>/, replaceStr);
        }
        return str;
    },

    randomStringAsync(length = 5, characterSet = "abcdefghijklmnopqrswxyz", capitalizeChance = 0.5) {
        return new Promise(resolve => {
            var characters = characterSet;
            var generated = "";
            for(var i = 0; i < length; i++) {
                var c = characters[Math.floor(Math.random() * characters.length)];
                if (Math.random() < capitalizeChance) {
                    c = c.toUpperCase();
                }
                generated += c;
            }
            return resolve(generated);
        })
        
    },


    reloadCommands () {
        const stuff = require('./stuff');
        return new Promise((resolve, reject) => {
            try {
                this.client.commands.clear()
                const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
                var oldCount = stuff.client.commands.size;
                var count = 0;
                for (const file of commandFiles) {
                    delete require.cache[resolve(`./commands/${file}`)]
                    const command = require(`./commands/${file}`);   
                    client.commands.set(command.name, command);
                    count++;
                }
                var newCommands = count - oldCount;
                return resolve(newCommands);
            } catch(err) {
                return reject(err);
            }
        })
    },



    /**
     * Repeats `callback` `times` times
     * @param {function(Number)} callback The code to repeat
     * @param {Number} times The amount of times to repeat `callback`
     * @returns {Promise<Number, Error | CommandError, any[]>} Promise for the completion of the loop
     */
    repeat (callback, times) {
        return Promise.resolve().then(() => {
            var iterations = 0;
            var data = [];
            try {
                for (var i = 0; i < times; i++) {
                    data.push(callback(i));
                    iterations++;
                }
                return [iterations, undefined, data];
            } catch (err) { 
                return [iterations, err, data];
            }
        })
    },
    sendError (channel, err) {
        var _err = err;
        
        if (typeof err == 'string') {
            _err = CommandError.fromString(err);
        } 
        var msgEmbed = {
            color: 0xff0000,
            title: _err.name || "oof",
            description: _err.message || _err.toString(),
    
        }
        if (_err.stack) {
            msgEmbed.fields = [
                {
                    name: "stack trace:",
                    value: _err.stack
                }
            ]
        }
        if (_err.footer) {
            msgEmbed.footer = {text: _err.footer}
        }
        channel.send({embed: msgEmbed});
        
    },

    getMaxHealth(user) {
        var db = this.db;
        if (db.exists(`/${user}/maxHealth`)) {
            return db.getData(`/${user}/maxHealth`)
        } else {
            return 100
        }
    },

    randomArrayElement(arr) {
        return arr[Math.floor(arr.length * Math.random())];
    },

    addDonated(user, amount) {
        var db = this.db;
        
        if (!db.exists(`/${user}/donated`)) db.push(`/${user}/donated`, 0);
        var curr = db.getData(`/${user}/donated`) || 0;

        db.push(`/${user}/donated`, curr + amount);
    },
    
    
    shopItems : {
            "spaghet": {
                name: "Spaghet",
                icon: ":spaghetti:",
                price: 100,
                inStock: 9999999,
                rarity: Rarity.blue,
                addedMultiplier: 3,
                description: "ha ha, Italian food go brrr!",
                type: "Consumable & Pet food",
                onUse: function(user) {
                    const stuff = require('./stuff');
                    stuff.addMultiplier(user, 3)
                    stuff.removeItem(user, "spaghet");
                    return true;
                }
            },
            "cake": {
                type: "Consumable",
                description: "Normal cake",
                multiplierMultiplier: 0.1,
                veModeExclusive: true,
                extraInfo: "Increases exponent",
                inStock: 999999999999999,
                rarity: Rarity.red,
                currency: "gold",
                price: 1000000,
                icon: "🍰",
                name: "Cake",
                onUse(user) {
                    var stuff = require('./stuff')
                    stuff.addMultiplierMultiplier(user, 0.1);
                    stuff.removeItem(user, "cake")
                    return true;
                }
            },
            "chilidog": {
                icon: '🌭',
                type: 'Consumable',
                inStock: 100000,
                name: "Chilidog",
                description: 'sonic reference go brrrrrr',
                veModeExclusive: true,
                addedMultiplier: 6900,
                multiplierMultiplier: 690,
                rarity: Rarity.pink,
                price: 1000,
                onUse(user) {
                    var stuff = require('./stuff')
                    stuff.removeItem(user, 'chilidog')
                    stuff.addMultiplierMultiplier(user, 6900)
                    stuff.addMultiplierMultiplier(user, 690)
                }
            },
            "full-cake": {
                type: "Consumable",
                multiplierMultiplier: 12,
                extraInfo: "Significantly increases exponent",
                inStock: 99999999999999999,
                price: 1000000000,
                currency: "gold",
                rarity: Rarity.pink,
                icon: "🎂",
                veModeExclusive: true,
                name: "Full Cake",
                onUse(user) {
                    var stuff = require('./stuff')
                    stuff.addMultiplierMultiplier(user, 12);
                    stuff.removeItem(user, "full-cake")
                    return true;
                }
            },
            "burger": {
                icon: '🍔',
                type: 'Consumable',
                inStock: 100000,
                name: "Burger",
                veModeExclusive: true,
                addedMultiplier: 7000,
                multiplierMultiplier: 700,
                rarity: Rarity.pink,
                price: 1100,
                onUse(user) {
                    var stuff = require('./stuff')
                    stuff.removeItem(user, 'burger')
                    stuff.addMultiplier(user, 7000)
                    stuff.addMultiplierMultiplier(user, 700)
                }
            },
            "pizza": {
                icon: '🍕',
                type: 'Consumable',
                inStock: 100000,
                name: "Pizza",
                veModeExclusive: true,
                addedMultiplier: 14000,
                multiplierMultiplier: 1400,
                rarity: Rarity.purple,
                price: 1700,
                onUse(user) {
                    var stuff = require('./stuff')
                    stuff.removeItem(user, 'pizza')
                    stuff.addMultiplier(user, 14000)
                    stuff.addMultiplierMultiplier(user, 1400)
                }
            },      
            "fries": {
                icon: '🍟',
                type: 'Consumable',
                inStock: 100000,
                name: "Fries",
                addedMultiplier: 10,
                veModeExclusive: true,
                rarity: Rarity.green,
                price: 150,
                onUse(user) {
                    var stuff = require('./stuff')
                    stuff.removeItem(user, 'fries')
                    stuff.addMultiplier(user, 10)
                }
            },  
            "sandwich": {
                icon: '🥪',
                type: 'Consumable',
                inStock: 100000,
                name: "Sandwich",
                addedMultiplier: 15,
                rarity: Rarity.green,
                price: 350,
                onUse(user) {
                    var stuff = require('./stuff')
                    stuff.removeItem(user, 'sandwich')
                    stuff.addMultiplier(user, 25)
                }
            }, 
            "venezuela-flag": {
                name: "Venezuela flag",
                type: "idk",
                description: "oh no",
                icon: '🇻🇪',
                inStock: 9999999999,
                rarity: Rarity.pink, //<:eggflag:779124272832053319>
                price: 10000000,
                extraInfo: "Enables venezuela mode",
                onUse(user, message) {
                    var stuff = require('./stuff')
                    if (stuff.dataStuff.getData('/').venezuelaMode) throw `Venezuela mode is already enabled!`
                    else {
                        stuff.venezuelaMode = true;
                        message.channel.send(`<:ohno:737474912666648688>`);
                        stuff.addMedal(user, stuff.medals['ve-mode'])
                        stuff.addAchievement(user, {
                            id: "other:venezuela",
                            name: "Venezuela mode",
                            description: "***How dare you enable venezuela mode***",
                            rarity: Rarity.purple
                        })
                        stuff.removeItem(user, "venezuela-flag")
                        return true;
                    }
                }
            },
            "egg-flag": {
                name: "Egg flag",
                type: "idk",
                description: "oh yes",
                icon: '<:eggflag:779124272832053319>',
                inStock: 99999999999,
                veModeExclusive: true,
                rarity: Rarity.purple, //<:eggflag:779124272832053319>
                price: 4869696969,
                extraInfo: "Disables venezuela mode",
                onUse(user, message) {
                    var stuff = require('./stuff')
                    stuff.venezuelaMode = false;
                    message.channel.send(`<:ohyes:737493602011316326>`);
                    stuff.addMedal(user, stuff.medals['eggflag'])
                    stuff.addAchievement(user, {
                        id: "other:eggflag",
                        name: "Egg flag",
                        description: "Cool, you disabled venezuela mode",
                        rarity: Rarity.purple
                    })
                    stuff.removeItem(user, "egg-flag")
                    return true;
                    
                }
            },
            "shield": {
                type: "Equipment",
                extraInfo: "Increases defense by 100 when equipped",
                inStock: 9999999999,
                rarity: Rarity.pink,
                price: 10000,
                veModeExclusive: true,
                equipable: true,
                unstackable: true,
                icon: "🛡️",
                name: "Shield",   
                onUse() {},
                onEquip(user) {
                    var stuff = require('./stuff');
                    stuff.addDefense(user, 100)
                },
                onUnequip(user) {
                    var stuff = require('./stuff');
                    stuff.addDefense(user, -100) 
                }
            },
            "ice-cube": {
                type: "Equipment",
                inStock: 9999999999999,
                rarity: Rarity.purple,
                equipable: true,
                veModeExclusive: true,
                unstackable: true,
                currency: "gold",
                name: "Ice Cube",
                icon: "🧊",
                price: 1750000000,
                onEquip(user) {
                    var stuff = require('./stuff')
                    stuff.addMultiplierMultiplier(user, 50000000)
                },
                onUnequip(user) {
                    var stuff = require('./stuff')
                    stuff.addMultiplierMultiplier(user, -50000000)
                }
            },
            "diamond": {
                type: "Equipment",
                extraInfo: "Increases multiplier by 10M when equipped",
                inStock: 9999999999999,
                rarity: Rarity.purple,
                equipable: true,
                currency: "gold",
                veModeExclusive: true,
                price: 100000,
                unstackable: true,
                icon: "💎",
                name: "Diamond",   
                onUse() {},
                onEquip(user) {
                    var stuff = require('./stuff');
                    stuff.addMultiplier(user, 10000000)
                },
                onUnequip(user) {
                    var stuff = require('./stuff');
                    stuff.addMultiplier(user, -10000000) 
                }
            },
            "coin": {
                type: "Consumable",
                extraInfo: "Gives points",
                extraData: {
                    pointCount: 1000000000,
                },
                inStock: 0,
                rarity: Rarity.red,
                price: 1,
                unlisted: true,
                unstackable: true,
                icon: "<:ip:770418561193607169>",
                name: "Coin",
                onUse(user, _message, _args, slot) {
                    var stuff = require('./stuff')
                    var it = stuff.getInventory(user)[slot]
                    stuff.addPoints(user, it.extraData.pointCount, `Used a coin`)
                    stuff.removeItem(user, "coin")
                    return true;
                }
            },  
            "life-drink": {
                type: "Consumable",
                extraInfo: "Significantly increases max health\nOnly usable when max health is 1.6k or higher",
                inStock: 99999999,
                rarity: Rarity.purple,
                currency: "gold",
                veModeExclusive: true,
                price: 10000,
                icon: "🥤",
                name: "Life Drink",
                onUse(user, _message, _args, slot) {
                    var stuff = require('./stuff')
                    if (stuff.getMaxHealth(user) < 1600) throw "You can't use this item until 1.6k max health!"
                    stuff.removeItem(user, "life-drink")
                    stuff.db.push(`/${user}/maxHealth`, stuff.getMaxHealth(user) + 100)
                    stuff.userHealth[user] = stuff.getMaxHealth(user);
                    return true;
                }
            }, 
            "pickaxe": {
                name: "Pickaxe",
                type: "Pickaxe",
                icon: "<:pickaxe:770078387385008138>",
                extraData: {
                    durability: 200
                },
                inStock: 9999999,
                price: 5000,
                rarity: Rarity.green,
                onEquip(user) {
                    var stuff = require('./stuff')
                    stuff.addAttack(user, 3)
                },
                onUnequip(user) {
                    var stuff = require('./stuff')
                    stuff.addAttack(user, -3)
                },
                onUse: function() {}
            },
            "copper-pickaxe": {
                name: "Copper Pickaxe",
                type: "Pickaxe",
                icon: "<:copperPickaxe:770457563355414558>",
                extraData: {
                    durability: 400,
                    miningPower: 2,
                },
                inStock: 9999999,
                unlisted: true,
                price: 10000,
                rarity: Rarity.blue,
                onUse: function() {},
                onEquip(user) {
                    var stuff = require('./stuff')
                    stuff.addAttack(user, 6)
                },
                onUnequip(user) {
                    var stuff = require('./stuff')
                    stuff.addAttack(user, -6)
                },
            },
            "titanium-pickaxe": {
                name: "Titanium Pickaxe",
                description: "ha ha yes logic 100",
                type: "Pickaxe",
                icon: "<:titaniumPickaxe:770732124793733151>",
                extraData: {
                    durability: 800,
                    miningPower: 4,
                },
                inStock: 9999999,
                unlisted: true,
                price: 10000,
                rarity: Rarity.red,
                onEquip(user) {
                    var stuff = require('./stuff')
                    stuff.addAttack(user, 12)
                },
                onUnequip(user) {
                    var stuff = require('./stuff')
                    stuff.addAttack(user, -12)
                },
                onUse: function() {}
            },
            "car": {
                name: "Venezuela car",
                icon: "🚗",
                price: 1000000000000,
                veModeExclusive: true,
                description: "It may be broken",
                extraInfo: "Summons the Car Lord",
                type: "Boss summon",
                rarity: Rarity.purple,
                inStock: 99999999999,
                onUse(user, message) {
                    
                        const stuff = require('./stuff');
                        stuff.removeItem(user, "car");
                        if (!stuff.currentBoss) {
                            stuff.currentBoss = {
                                name: "Car Lord",
                                health: 50000,
                                drops: 1000000000000000000,
                                maxHealth: 50000,
                                damage: 350,
                                itemDrops: [
                                    "cake",
                                    "cake",
                                    "coin",
                                    "coin",
                                    "milk",
                                    "baguette",
                                    "life-drink",
                                    "diamond",
                                    "shield"
                                ],
                                fighting: [
                                    user
                                ]
                            }
                            
                            message.channel.send("Car Lord has awoken!")
                        }
                    
                }
            },
            "rock": {
                name: "Rock",
                icon: "<:roc:770035638250504222>",
                price: 5,
                unlisted: true,
                rarity: Rarity.gray,
                description: 'Just a normal rock',
                onUse: function() {}
            },
            "copper": {
                name: "Copper",
                icon: "<:copper:770035910334349334>",
                price: 50,
                unlisted: true,
                rarity: Rarity.white,
                onUse: function() {}
            },
            "titanium": {
                name: "Titanium",
                icon: "<:titanium:770035840084475945>",
                price: 500,
                unlisted: true,
                rarity: Rarity.blue,
                onUse: function() {}
            },
            "madkeanu": {
                name: "Triggered Keanu",
                icon: "<a:madakeanu:740386877093314702>",
                description: "Keanu was mad because <:v_:755546914715336765> was yeeted!",
                extraInfo: "Summons a <:oO:749319330503852084> pet",
                type: "Pet summon",
                price: 750,
                inStock: 99999999999,
                rarity: Rarity.blue,
                pet: {
                    name: "oO", 
                    icon: "<:oO:749319330503852084>", 
                    id: "oo", 
                    food: "cookie",
                    baseMultiplierAdd: 100
                },
                onUse: function(user, message) {
                    const stuff = require('./stuff');
                    stuff.removeItem(user, "madkeanu");
                    stuff.db.push(`/${user}/pets[]`, {
                        name: "oO", 
                        icon: "<:oO:749319330503852084>", 
                        id: "oo", 
                        food: "cookie",
                        happiness: stuff.clamp(1 * Math.random(), 0.2, 1),
                        baseMultiplierAdd: 25
                    })
                    return true;
                }
            },
            "router-alloy": {
                name: "Router Alloy",
                icon: "<:r_:741096370089361508>",
                price: 3000,
                unlisted: true,
                inStock: 99999999,
                rarity: Rarity.red,
                description: "It can summon a router!",
                type: "Pet summon",
                extraInfo: "Summons a router pet",
                pet: {
                    name: "Router", 
                    icon: "<:router:739890062820638751>", 
                    id: "router", 
                    food: "bread"
                },
                onUse: function(user, message) {
                    const stuff = require('./stuff');
                    stuff.removeItem(user, "router-alloy");
                    stuff.db.push(`/${user}/pets[]`, {
                        name: "Router", 
                        icon: "<:router:739890062820638751>", 
                        id: "router", 
                        happiness: stuff.clamp(0.6 * Math.random(), 0.25, 0.7),
                        food: "bread"
                    })
                    return true;
                }
            },
            "web": {
                name: "Spider Web",
                icon: ":spider_web:",
                price: 7000,
                inStock: 99999999,
                rarity: Rarity.red,
                description: "Can trigger arachnophobia!",
                type: "Pet summon",
                extraInfo: "Summons a spider pet",
                pet: {
                    name: "Spider", 
                    icon: ":spider:", 
                    id: "spider", 
                    damage: 50,
                    baseMultiplierAdd: 350,
                    food: "spaghet"
                },
                onUse: function(user, message) {
                    const stuff = require('./stuff');
                    stuff.removeItem(user, "web");
                    stuff.db.push(`/${user}/pets[]`, {
                        name: "Spider", 
                        icon: ":spider:", 
                        id: "spider", 
                        happiness: stuff.clamp(0.6 * Math.random(), 0.25, 1.2),
                        damage: 50,
                        baseMultiplierAdd: 350,
                        food: "spaghet"
                    })
                    if (!stuff.currentBoss && Math.random() < 0.1) {
                        stuff.currentBoss = {
                            name: "Giant Tarantula",
                            health: 95000,
                            damageReduction: 1.3,
                            drops: 100000000000000000,
                            itemDrops: ["cake", "coin", "baguette", "madkeanu"],
                            maxHealth: 95000,
                            damage: 700,
                            fighting: [
                                user
                            ]
                        }
                        message.channel.send("Giant Tarantula has awoken!")
                    }
                    return true;
                }
            },
            "cooked-egg": {
                name: `Cooked egg`,
                icon: ":cooking:",
                price: 750000,
                inStock: 999999999,
                rarity: Rarity.red,
                description: "You should feel bad about that unborn chicken!",
                type: "Consumable & Boss Summon",
                extraInfo: "Summons Egg Lord Prime",
                addedMultiplier: 7,
                onUse: function(user, message) {
                    const stuff = require('./stuff');
                    stuff.addMultiplier(user, 7)
                    stuff.removeItem(user, "cooked-egg");
                    if (!stuff.currentBoss) {
                        stuff.currentBoss = {
                            name: "Egg Lord Prime",
                            health: 65000,
                            drops: 1000000000000000,
                            damageReduction: 2,
                            damage: 900,
                            maxHealth: 100000,
                            itemDrops: ["reverse-card", "eggs", "coin", "cake", "cake", "eggs", "egg", "coin", "cake", "life-drink", "life-drink", "full-cake", "shield", "diamond"],
                            fighting: [
                                user
                            ]
                        }
                        message.channel.send("Egg Lord Prime has awoken!")
                        
                    }
                    return true;
                }
            },
            "cookie": {
                name: "Cookie",
                icon: ":cookie:",
                price: 5,
                inStock: 99999999,
                rarity: Rarity.gray,
                type: "Pet food",
                onUse: function(user, message) {
                    const stuff = require('./stuff');
                    stuff.removeItem(user, "cookie");
                    return true;
                }
            },
            "coffee": {
                name: "Coffee",
                icon: ":coffee:",
                price: 50,
                inStock: 99999999,
                rarity: Rarity.white,
                type: "Consumable",
                addedMultiplier: 1.1,
                description: "It will make you stay awake at 3AM!",
                onUse: function(user, message) {
                    const stuff = require('./stuff');
                    stuff.addMultiplier(user, 1.1)
                    stuff.removeItem(user, "coffee");
                    return true;
                }
            },
            "orange-juice": {
                name: "Orange juice",
                icon: ":beverage_box:",
                price: 300,
                addedMultiplier: 3,
                rarity: Rarity.blue,
                inStock: 99999999,
                type: "Consumable & Boss summon",
                description: "Dani said it was cringe, but they are now allies!",
                extraInfo: "Summons the Milk Gang",
                onUse: function(user, message) {
                    const stuff = require('./stuff');
                    stuff.addMultiplier(user, 3)
                    stuff.removeItem(user, "orange-juice");
                    if (!stuff.currentBoss) {
                        stuff.currentBoss = {
                            name: "Milk Gang",
                            health: 21000,
                            drops: 10000000000000000,
                            maxHealth: 21000,
                            itemDrops: ["milk", "baguette"],
                            damage: 100,
                            fighting: [
                                user
                            ]
                        }
                        message.channel.send("Milk Gang has awoken!")
                    }
                    return true;
                }
            },
            "milk": {
                name: "Milk",
                icon: ":milk:",
                price: 400,
                type: "Consumable",
                inStock: 99999999,
                rarity: Rarity.blue,
                addedMultiplier: 4,
                description: "Dani likes it a lot!",
                onUse: function(user, message) {
                    const stuff = require('./stuff');
                    stuff.addMultiplier(user, 4)
                    stuff.removeItem(user, "milk");
                    return true;
                }
            },
            "baguette": {
                name: "Baguette",
                icon: ":french_bread:",
                price: 500,
                inStock: 99999999,
                type: "Consumable",
                rarity: Rarity.blue,
                addedMultiplier: 5,
                description: "Thicc bread, but it's actually thicc in only one direction",
                onUse: function(user, message) {
                    const stuff = require('./stuff');
                    stuff.addMultiplier(user, 5)
                    stuff.removeItem(user, "baguette");
                    return true;
                }
            },
            "bread": {
                name: "Bread",
                icon: ":bread:",
                price: 20,
                type: "Consumable & Pet food",
                inStock: 99999999,
                rarity: Rarity.white,
                addedMultiplier: 0.5,
                description: "Normal bread... maybe a bit too normal",
                onUse: function(user, message) {
                    const stuff = require('./stuff');
                    stuff.addMultiplier(user, 0.5)
                    stuff.removeItem(user, "bread");
                    return true;
                }
            },
            "cd-1": {
                name: "Suspicious looking CD",
                icon: ":cd:",
                price: 50,
                inStock: 9999999999,
                rarity: Rarity.white,
                unstackable: true,
                type: "Other",
                onUse() {},
                addedPackage: "sus",
            },
    },

    emojis: {
        ohno: '737474912666648688',
        ohyes: '737493602011316326',
    },

    getPendingCommands() {
        var cmds = fs.readdirSync("pending/");
        var r = [];
        for (const file of cmds) {
            delete require.cache[resolve(`./pending/${file}`)];
            r.push(require(`./pending/${file}`))
        }
        return r;
    },

    setExistenceExpiration(user, slot, when, expired = false) {
        var s = require('./stuff')
        s.db.push(` /${user}/inventory/${slot}/extraData/existence/expires`, when)
        s.db.push(` /${user}/inventory/${slot}/extraData/existence/expired`, expired)
    },

    approveCommand(cmd) {
        var s = require('./stuff')
        if (fs.existsSync(`pending/${cmd}.js`)) {
            fs.renameSync(`pending/${cmd}.js`, `phone-commands/${cmd}.js`);
            s.loadPhoneCommands();
        } else {
            throw `the command \`${cmd}\` doesn't exist`
        }
    },

    getItemProperty(user, slot, prop) {
        var s = require('./stuff')
        return s.db.getData(`/${user}/inventory[${slot}]/extraData/${prop}`)
    },
    setItemProperty(user, slot, prop, value) {
        var s = require('./stuff')
        s.db.push(`/${user}/inventory[${slot}]/extraData/${prop}`, value)
    },
    startBattle(user, _e) {
        if (typeof _e == 'string') _e = this.enemies[_e]
        var e = {
            name: _e.name,
            type: _e,
            id: _e.id,
            maxHealth: _e.minHealth + Math.random() * (_e.maxHealth - _e.minHealth),
            attack: _e.minAttack + Math.random() * (_e.maxAttack - _e.minAttack),
            defense: _e.minDefense + Math.random() * (_e.maxDefense - _e.minDefense),
            health: 0,
            moneyDrop: _e.moneyDrop,
        }
        e.health = e.maxHealth;
        this.fighting[user] = e;
    },
    backup() {
        var contents = fs.readFileSync('userdata.json', 'utf8')
        var now = new Date(Date.now())
        var filename = `backups/${now.getFullYear()}/${now.getMonth()}/`;
        var exists = fs.existsSync(filename);
        if (!exists) {
            fs.mkdirSync(filename, {recursive: true});
            fs.writeFileSync(filename + `${now.getDate()}.json`, contents, 'utf8')
        } else {
            fs.writeFileSync(filename + `${now.getDate()}.json`, contents, 'utf8')
        }
        console.log("Backup succesful")
    },
    formatOptions: {
        filesize: [  
            {
                suffix: 'B',
                min: 0,
                decimalPlaces: 0,
                unchanged: true,
            },
            {
                suffix: 'KiB',
                decimalPlaces: 2,
                min: 1024,
            },
            {
                suffix: 'MiB',
                decimalPlaces: 2,
                min: 1024 * 1024,
            },
            {
                suffix: 'GiB',
                decimalPlaces: 2,
                min: 1024 * 1024 * 1024,
            },
            {
                suffix: 'TiB',
                decimalPlaces: 2,
                min: 1024 * 1024 * 1024 * 1024,
            },
            {
                suffix: 'PiB',
                decimalPlaces: 2,
                min: 1024 * 1024 * 1024 * 1024 * 1024,
            },
        ],
        number: [
            {
                suffix: '',
                decimalPlaces: 0,
                min: 0,
                unchanged: true,
            },
            {
                suffix: ' K',
                decimalPlaces: 2,
                min: 1000n,
            },
            {
                suffix: ' M',
                decimalPlaces: 2,
                min: 1000000n,
            },
            {
                suffix: ' B',
                decimalPlaces: 2,
                min: 1000000000n,
            },
            {
                suffix: ' T',
                decimalPlaces: 2,
                min: 1000000000000n,
            },
            {
                suffix: ' Qd',
                decimalPlaces: 2,
                min: 1000000000000000n,
            },
            {
                suffix: ' Qn',
                decimalPlaces: 2,
                min: 1000000000000000000n,
            },
            {
                suffix: ' Sx',
                decimalPlaces: 2,
                min: 1000000000000000000000n,
            },
            {
                suffix: ' Sp',
                decimalPlaces: 2,
                min: 1000000000000000000000000n,
            },
            {
                suffix: ' O',
                decimalPlaces: 2,
                min: 1000000000000000000000000000n,
            },
            {
                suffix: ' N',
                decimalPlaces: 2,
                min: 1000000000000000000000000000000n,
            },
            {
                suffix: ' D',
                decimalPlaces: 2,
                min: 1000000000000000000000000000000000n,
            },
            {
                suffix: ' Ud',
                decimalPlaces: 2,
                min: 1000000000000000000000000000000000000n,
            },
            {
                suffix: ' Dd',
                decimalPlaces: 2,
                min: 1000000000000000000000000000000000000000n,
            },
            {
                suffix: ' Td',
                decimalPlaces: 2,
                min: 1000000000000000000000000000000000000000000n,
            },
            {
                suffix: ' Qdd',
                decimalPlaces: 2,
                min: 1000000000000000000000000000000000000000000000n,
            },
            {
                suffix: ' Qnd',
                decimalPlaces: 2,
                min: 1000000000000000000000000000000000000000000000000n,
            },
            {
                suffix: ' Sxd',
                decimalPlaces: 2,
                min: 1000000000000000000000000000000000000000000000000000n,
            },
            {
                suffix: ' Spd',
                decimalPlaces: 2,
                min: 1000000000000000000000000000000000000000000000000000000n,
            },
            {
                suffix: ' Od',
                decimalPlaces: 2,
                min: 1000000000000000000000000000000000000000000000000000000000n,
            },
            {
                suffix: ' Nd',
                decimalPlaces: 2,
                min: 1000000000000000000000000000000000000000000000000000000000000n,
            },
            {
                suffix: ' Vg',
                decimalPlaces: 2,
                min: 10n ** 63n,
            },
            {
                suffix: ' UVg',
                decimalPlaces: 2,
                min: 10n ** 66n,
            },
            {
                suffix: ' DVg',
                decimalPlaces: 2,
                min: 10n ** 69n,
            },
            {
                suffix: ' TVg',
                decimalPlaces: 2,
                min: 10n ** 72n,
            },
            {
                suffix: ' QdVg',
                decimalPlaces: 2,
                min: 10n ** 75n,
            },
            {
                suffix: ' QnVg',
                decimalPlaces: 2,
                min: 10n ** 78n,
            },
            {
                suffix: ' SxVg',
                decimalPlaces: 2,
                min: 10n ** 81n,
            },
            {
                suffix: ' SpVg',
                decimalPlaces: 2,
                min: 10n ** 84n,
            },
            {
                suffix: ' NVg',
                decimalPlaces: 2,
                min: 10n ** 87n,
            },
            {
                suffix: ' OVg',
                decimalPlaces: 2,
                min: 10n ** 90n,
            },
            {
                suffix: ' Tg',
                decimalPlaces: 2,
                min: 10n ** 93n,
            },
            {
                suffix: ' Cn',
                decimalPlaces: 2,
                min: 10n ** 303n,
            },
        ]
    },
    betterFormat(value, options) {
        var s = this;
        if ((typeof value != 'number' && typeof value != 'bigint')) return `NaN`
        if (typeof value != 'bigint' && isNaN(value)) return `NaN`
        try {
            if (typeof value == 'number') value = BigInt(Math.floor(value))
            var f = options[0]
            for (const _f of options) {
                if (value >= _f.min) f = _f;
            }
            var result = 0;
            if (!f.unchanged) result = Number(s.clamp(Number(value) / Number(f.min), -Number.MAX_VALUE, Number.MAX_VALUE))
            else result = Number(s.clamp(value, -Number.MAX_VALUE, Number.MAX_VALUE))
            return `${result.toFixed(f.decimalPlaces ?? 1)}${f.suffix}`
        } catch (err) {
            console.log(err)
            return value + ""
        }
    },
    loadPhoneCommands() {
        var s = require('./stuff')
        s.phoneCommands.clear()
        const commandFiles = fs.readdirSync('./phone-commands');
        for (const file of commandFiles) {
            
            
            delete require.cache[resolve(`./phone-commands/${file}`)]
            
            const command = require(`./phone-commands/${file}`);

            if (!s.validPackages.includes(command.package) && command.package != undefined) {
                s.validPackages.push(command.package);
            }
        
            
            s.eggscriptInstructions[command.name] = (message, args, phoneData, slot) => command.execute(message, args, phoneData, slot)
            s.phoneCommands.set(command.name, command);
        }
        
        console.log('Finished loading phone commands')
    },

    addAchievement(user, {id, name, description, rarity}) {
        var s = require('./stuff')
        var a = s.getAchievements(user);
        if (a.map(el => el.id).includes(id)) return;
        a.push({id: id, name: name, description: description, gotWhen: Date.now(), rarity: rarity});
        s.db.push(`/${user}/achievements`, a)
        s.client.channels.cache.get(s.getConfig("achievements")).send({embed: {
            title: `${s.client.users.cache.get(user).username} Got the S${s.getConfig("season")} Achievement '${name}'!`,
            description: `**Achievement description**: ${description}`,
            color: rarity || Rarity.blue
        }})
    },

    getAchievements(user) {
        var s = require('./stuff')
        var a = s.db.getData(`/${user}/`).achievements || [];
        return a;
    },

    getEquipment(user) {
        var s = require('./stuff')
        var equipment = s.db.getData(`/${user}/`).equipment || [];
        return equipment;
    },

    addEquipment(user, slot) {
        var s = require('./stuff')
        var item = s.getInventory(user)[slot];
        if (!s.shopItems[item.id].onEquip) throw new CommandError("<:v_:755546914715336765>", `How are you supposed to equip ${item.icon} ${item.name}?`)
        var equipment = s.db.getData(`/${user}/`).equipment || [];
        if (equipment.length + 1 > s.getEquipmentSlots(user)) throw new CommandError("oh no", `You can't equip more than ${this.getEquipmentSlots(user)} items!`)
        equipment.push(item);
        s.shopItems[item.id].onEquip(user, equipment.length);
        s.db.push(`/${user}/equipment`, equipment)
        s.db.delete(`/${user}/inventory[${slot}]`)
    },

    removeEquipment(user, slot) {
        var s = require('./stuff')
        var u = s.db.data[user]
        if (u.inventory.length + 1 > u.maxItems) throw `Inventory limit reached`
        s.addItem(user, item);
        var item = s.getEquipment(user)[slot]
        if (!item) throw `no`
        s.db.delete(`/${user}/equipment[${slot}]`);
        s.shopItems[item.id].onUnequip(user, slot)
    },

    getEquipmentSlots(user) {
        var s = require('./stuff')
        var user = s.db.getData(`/${user}/`)
        return user.equipmentSlots || 4;
    },

    async download(url) {
        return request.get(url)
    },

    async submit(url, filename) {
        var req = await this.download(url);
        return req.pipe(fs.createWriteStream(`pending/${filename}`));
    },



    getMultiplier(user, raw = true) {
        var s = require('./stuff')
        if (raw) return s.db.getData(`/${user}/multiplier`) || 1;
        if (!raw) return (s.db.getData(`/${user}/multiplier`) || 1) * (s.db.getData(`/${user}/`).multiplierMultiplier || 1);
    },

    getMultiplierMultiplier(user) {
        var s = require('./stuff')
        return s.db.getData(`/${user}/`).multiplierMultiplier || 1;
    },

    getInventory(user) {
        var s = require('./stuff')
        return s.db.getData(` /${user}/inventory`).filter(el => {
            return el.name != undefined && el.icon != undefined;
        });
    },

    ___format(value) {
        if (!value && value != 0) return "<invalid number>"
        return numeral(value).format("0.0a")
    },
    // don't ask why i'm keeping the old functions
    __format(value) {
        if (!value && value != 0) return "<invalid number>"
        var newValue = value;
        if (value >= 1000) {
            var suffixes = ["", "k", "M", "B", "T", "q", "Q", "s", "S", "O", "N"];
            var suffixNum = Math.floor( (""+value).length/3 );
            var shortValue = '';
            for (var precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
                var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                if (dotLessShortValue.length <= 2) { break; }
            }
            if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
            newValue = shortValue+suffixes[suffixNum];
        }

        return newValue;
    },
    get userdataPath() {
        return resolve('./userdata.json')
    },
    format(number, options = {k: "k", m: "M", b: "B", t: "T", q: "q", Q: "Q", s: "s", S: "S", O: "O", N: "N"}) {
        var s = require('./stuff');
        return s.betterFormat(number, s.formatOptions.number);
        try {
            var clamp = this.clamp;
            if (typeof number == "bigint") number = Number(clamp(number, Number.MIN_VALUE, Number.MAX_VALUE))
            var r;
            var v = Math.floor(Math.abs(number));
            var prefix = "";
            // 1000000000000000000
            if (v > 998n && v < 999999n) {
                r = (number / 1000) + options.k || "k";
                prefix = "K"
            } else if (v > 999998n && v < 999999999n) {
                r = (number / 1000000) + options.m || "M";
                prefix = "M"
            } else if (v > 999999998n && v < 999999999999n) {
                r = (number / 1000000000) + options.b || "B";
                prefix = "B"
            } else if (v > 999999999998n && v < 999999999999999n){
                r = (number / 1000000000000) + options.t || "T";
                prefix = "T"
            } else if (v > 999999999999998n && v < 999999999999999999n) {
                r = (number / 1000000000000000) + options.q || "q";
                prefix = "q"
            } else if (v > 999999999999999998n && v < 999999999999999999999n) {
                r = (number / 1000000000000000000) + options.Q || "Q";
                prefix = 'Q'
            } else if (v > 999999999999999999998n && v < 999999999999999999999999n) {
                r = (number / 1000000000000000000000) + options.s || "s";
                prefix = "s"
            } else if (v > 999999999999999999999998n && v < 999999999999999999999999999n) {
                r = (number / 1000000000000000000000000) + options.S || "S";
                prefix = 'S'
            } else if (v > 999999999999999999999999998n && v < 999999999999999999999999999999n) {
                r = (number / 1000000000000000000000000000) + options.O || "O";
                prefix = 'O'
            } else if (v > 999999999999999999999999999998n && isFinite(v)) {
                r = BigInt(Math.floor(number / 1000000000000000000000000000000)) + options.N || "N";
                prefix = 'N'
            } else {
                if (!isFinite(v) && v) return (v < 0) ? '-∞' : '∞' 
                if (Math.floor(number) !== number) {
                    r = number.toFixed(1);
                } else {
                    r = number;
                }
            }
            var _r = parseFloat(r);
            if (Math.floor(_r) !== _r) {
                if (prefix == "N") {
                    r = BigInt(Math.floor(_r)) + prefix
                } else r = _r.toFixed(1) + prefix
            } else {
                r = BigInt(Math.floor(_r)) + prefix
            }
            return r;
        } catch (er) {
            console.log(er)
            return `${typeof number == 'number' ? number.toFixed(1) : number} <${er.name}>`
        }
    },
    
    addPackage: function(user, slot, package) {  
        const stuff = require('./stuff');



        
        
        if (stuff.validPackages.includes(package)) {
            

            

            var inv = stuff.db.getData(` /${user}/inventory`)
            inv[slot].extraData.packages.push(package);
            stuff.db.push(` /${user}/inventory`, inv)
            
            

            

        } else {
            throw `could not find package \`${package}\``
        }
        
    },
    
    addMultiplier(user, amount) {
        this.db.push(` /${user}/multiplier`, this.getMultiplier(user) + amount)
    },
    addMultiplierMultiplier(user, amount) {
        this.db.push(` /${user}/multiplierMultiplier`, this.getMultiplierMultiplier(user) + amount)
    },

    addItem(user, item, extraData) {   
        var _item = item;
        if (this.db.data[user].inventory.length + 1 > this.db.data[user].maxItems) throw `Inventory limit reached`
        if (typeof item == 'string') {
            var items = this.shopItems;
            var i = Object.create(items[item])
            if (extraData) i.extraData = extraData
            _item = i;
        }
        this.db.push(`/${user}/inventory[]`, {id: item.id || _item.id || item, name: _item.name, extraData: _item.extraData, icon: _item.icon})
    },

    removeItem(user, itemName, count = 1) {
        var items = this.db.getData(` /${user}/inventory/`);



        var times = 0;
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            if (element.id == itemName && times < count) {
                items.splice(i, 1);
                times++;
            }
        }
         
        this.db.push(` /${user}/inventory/`, items) 
        return times > 0; 
    },




    
    string2stringArray(str) {
        var regex = /\[(.*)\]/;
        var matches = regex.exec(str);
        var match = matches[1];
        var entries = match.split(",");

        var resultEntries = [];

        entries.forEach(entry => {
            resultEntries.push(entry.trimStart());
        })

        var r = resultEntries.filter(function(el) {
            return el.trim() != "" && el != undefined
        })
        
        return r;
    },
    
    clamp (number, min, max) {
        if (number > max) {
            return max;
        } else if (number < min) {
            return min;
        } else {
            return number;
        }
    },
    
    addPoints (user, amount, reason) {
        var a = BigInt(Math.floor(amount) || 0);
        
        var h = this;
        if (amount > 0) this.db.push(`/${user}/points`, (h.getPoints(user) + a).toString())
        else this.db.push(`/${user}/points`, (h.getPoints(user) - a).toString())
    },
    getPoints (user) {
        var h = this
        return BigInt(h.clamp(parseInt(this.db.getData(`/${user}/`).points || 0), Number.MIN_VALUE / 2, Number.MAX_VALUE)) || 0n;
    },
    setPhoneVer (user, slot, ver, verName) {
        var items = this.db.getData(` /${user}/inventory/`);
        items[slot].extraData.ver = ver;
        items[slot].extraData.verName = verName;
        this.db.push(` /${user}/inventory`, items)
    },

    getConfig(setting, fallback = true) {
        var config = JSON.parse(fs.readFileSync("more-config.json").toString().replace("}}", "}"));
        

        return config[setting] ?? fallback;
    },

    set(setting, value) {
        var config = JSON.parse(fs.readFileSync("more-config.json").toString().replace("}}", "}"));
        config[setting] = value;

        fs.writeFileSync("more-config.json", JSON.stringify(config, undefined, 4).toString().replace("}}", "}"));
    },
    
    
    setPermission (user, perm, value) {
        this.db.push(` /${user}/permissions/${perm}`, value);
    },
    addRolePermission(role, perm) {
        var perms = this.roles.getData(`/${role}/permissions`);
        if (perms.includes(perm)) return;
        this.roles.push(`/${role}/permissions[]`, perm)
    },
    removeRolePermission(role, perm) {
        var perms = this.roles.getData(`/${role}/permissions`);
        var index = perms.indexOf(perm);
        this.roles.delete(`/${role}/permissions[${index}]`)
    },
    
    
    
    /**
     * just like array.forEach() but for settings
     * @param {void} callback function that accepts 2 arguments, will be called every iteration
     */
    
    forEachSetting(callback) {
        var config = JSON.parse(fs.readFileSync("more-config.json"));
        var entries = Object.entries(config);

        entries.forEach(element => {
            callback(element[0], element[1]);
        })

    },
    removeSetting(name) {
        var obj = JSON.parse(fs.readFileSync("more-config.json", 'utf8'))
        var d = delete obj[name]
        fs.writeFileSync("more-config.json", JSON.stringify(obj, null, 4))
        return d
    },
    
    how2(thing) {
        var data = JSON.parse(fs.readFileSync('how2.json', 'utf8'));

        if (data[thing] == undefined) {
            throw `could not find how 2 ${thing}`;
        }

        return data[thing];
    },

    forEachHow2(callback) {
        var data = JSON.parse(fs.readFileSync('how2.json', 'utf8'));
        var entries = Object.entries(data);

        entries.forEach(element => {
            callback(element[0], element[1]);
        })
    },
    


    string2bool(str) {
        if (str == "true") return true;
        if (str == "false") return false;
        return undefined;
    },
    
    getPermission(user = "", perm = "", guildId) {
        var client = this.client;
        var roles = this.roles;
        if (user == "602651056320675840") return true;
        try {
            if (!guildId) {
                ;
                var v = this.db.getData(`/${user}/permissions/`)[perm];
                return v;
            } else {
                var member = client.guilds.cache.get(guildId).member(user);
                var perms = {};
                member.fetch();
                
                member.roles.cache.forEach((_r, id) => {
                    if (!roles.exists(`/${id}/permissions`)) roles.push(`/${id}/`, { permissions: [] });
                    var p = roles.getData(`/${id}/permissions`)
                    p.forEach(v => {perms[v] = true})
                })
                ;
                var segments = perm.split(".");
                for (var i = 0; i < segments.length; i++) {
                    var s = segments.slice(0, i).join(".")
                     
                    if (perms[`${s}.*`]) return true;
                }
                
                return perms[perm] ?? false;
            }
        } catch (_e) {
            
            return false;
        }
    },
    permissions(user, guildId) {
        try {            
            var perms = {};
            var client = this.client;
            var roles = this.roles;
            var member = client.guilds.cache.get(guildId).member(user);
            member.fetch();
            member.roles.cache.forEach(role => {
                if (!roles.exists(`/${role.id}/permissions`)) roles.push(`/${role.id}/`, []);
                var p = roles.getData(`/${role.id}/permissions`)
                p.forEach(v => perms[v] = true)
            })
            return perms;
        } catch (_e) {
            ;
            return {};
        }
    },
    getCheats(user) {
        return this.db.getData(`/${user}/`).cheats || {};
    },
    getUnlockedCheats(user) {
        return this.db.getData(`/${user}/`).unlockedCheats || {}
    },
    addCheat(user, cheat) {
        var e = this;
        var c = this.getUnlockedCheats(user)
        if (!c[cheat]) {
            e.client.channels.cache.get(e.getConfig('achievements')).send({embed: {
                description: `<@${user}> Unlocked the "${e.cheats[cheat]?.name || "???"}" cheat`,
                footer: { text: `You can do ';cheats list' to see a list of your cheats and ';cheats toggle <cheat name>' to toggle a cheat` }
            }})
        }
        c[cheat] = true;
        this.db.push(`/${user}/unlockedCheats`, c)
    },
    setCheat(user, cheat, value) {
        var unlocked = this.getUnlockedCheats(user)
        if (!unlocked[cheat]) throw `You haven't unlocked this yet`
        var c = this.getCheats(user)
        if (value != undefined) c[cheat] = value;
        else c[cheat] = !c[cheat]
        this.db.push(`/${user}/cheats`, c)
        return c[cheat]
    },
    argConversion: (arg, str, message) => {
        
        var conversions = require('./stuff').conversions;
        var v = conversions[arg.type](str, message)
        var _default = conversions[arg.type](arg.default ?? "", message)
        var h = (v == undefined || (isNaN(v) && typeof v == 'number') || v == '') ? _default : v
        
        return h;
    },
    argsThing(command, newArgs, message) {
        if (command.arguments) {
            var argsObject = {};
            const argConversion = (arg, str, message) => {
                
                var conversions = require('./stuff').conversions;
                var v = conversions[arg.type](str, message)
                var _default = conversions[arg.type](arg.default ?? "", message)
                var h = (v == undefined) ? _default : v
                if (isNaN(h) && typeof h == 'number') h = _default;
                
                return h;
            }
            var a = [];
            var requiredArgs = command.arguments.filter(el => !el.optional);
            command.arguments.forEach((arg, i) => {
                
                var el = newArgs[i];
                if (i >= command.arguments.length - 1) el = newArgs.slice(i).join(" ");
                var val = argConversion(arg, el, message);
                if (command.useArgsObject) argsObject[arg.name] = val
                if (command.useArgsObject) argsObject["_" + arg.name] = el ?? arg.default
                a[i] = val;
            })
            if (command.useArgsObject) a = argsObject
            return a;
        } else return newArgs
    },
    addMaxHealth(user, amount) {
        var h = this.getMaxHealth(user)
        this.db.push(`/${user}/maxHealth`, h + amount)
    },
    conversions: {
        string: (str) => {
            return str
        },
        number: parseFloat,
        member: (str, message) => {
            var regex = /<@!?(\d+)>/
            var match = str.match(regex) || [];
            return message.guild.member(match[1]);
        },
        stringArray: (str, message) => {
            var regex = /\[([^\[\]]+)\]/
            var match = str.match(regex) || [];
            var elements = (match[1] || "").split(",").map(el => el.trim())
            return elements;
        },
        role: (str, message) => {
            if (str == '@everyone' || str == 'everyone') return message.guild.roles.everyone
            var regex = /<@&?(\d+)>/
            var match = str.match(regex) || {};
            message.guild.roles.fetch(match[1] || str);
            return message.guild.roles.cache.get(match[1] || str)
        },
        positiveInt: str => {
            return Math.abs(parseInt(str))
        },
        int: str => {
            return parseInt(str)
        },
        positiveNumber: str => {
            return Math.abs(parseFloat(str))
        },
        user: (str, message) => {
            var stuff = require('./stuff');
            if (!str) return message.author;
            if (str.toString() == "me") return message.author;
            var regex = /<@!{0,}(\d+)>/
            var match = str.match(regex) || ['', ''];
            return message.client.users.cache.get(match[1]);
        },
        inventoryItem: (str, message) => {
            
            
            var stuff = require('./stuff')
            var inv = stuff.getInventory(message.author.id).map(el => el.id)
            ;
            var slot = inv.indexOf(str);
            
            if (inv[parseInt(str)] != undefined) return parseInt(str)
            if (slot < 0 && inv[0] != str) return undefined
            return slot;
        },
        formattedNumber: (str) => {
            var stuff = require('./stuff')
            var prefixes = ["", "k", "M", "B", "T", "q", "Q", "s", "S", "O", "N"]
            var match = str.match(/([\d.-]+) *(\w?)/);
            if (match == null) return undefined;
            var number = parseFloat(match[1] || "0")
            var prefix = match[2] || "";
            var multiplier = Math.pow(10, stuff.clamp(prefixes.indexOf(prefix) * 3, 0, Infinity))
            return number * multiplier;
        },

        bool: str => str == 'true',
        /**
         * @param {string} str
         */
        any: (str, message) => {
            var conversions = require('./stuff').conversions
            var number = parseFloat(str)
            if (!isNaN(number)) return number;
            if (str == "true" || str == 'false') return conversions.bool(str)
            return str;
        }
    },

    updateVenezuelaMode() {
        var self = this;
        var value = self.dataStuff.getData(`/venezuelaMode`);
        if (value) {
            Object.entries(self.shopItems).forEach(([k, v]) => {
                v.price = self.originalPrices[k] * 250000;
            })
        } else {
            Object.entries(self.shopItems).forEach(([k, v]) => {  
                if (self.originalPrices[k]) v.price = self.originalPrices[k];
            })
        }
    },
    updateStonks() {
        var self = this;
        Object.entries(self.shopItems).forEach(([k, v]) => {  
            var m = k.stonkMult ?? 1;
            var percent = ((self.randomRange(self.getConfig('stonksMinPercent'), self.getConfig('stonksMaxPercent')) - 1) * m) + 1
            self.stonks[k] = { mult: 1 + percent, percent }
        })
        var i = self.shopItems;
        var h = Object.entries(self.stonks).sort((a, b) => {
            var aDiff = (i[a[0]].price * a[1].mult) - i[a[0]].price
            var bDiff = (i[b[0]].price * b[1].mult) - i[b[0]].price
            return bDiff - aDiff
        });
        var embed = {
            title: "Updated Stonk Market",
            description: `${h.map(el => {
                var diff = (i[el[0]].price * el[1].mult) - i[el[0]].price;
                return `${i[el[0]].icon} **${i[el[0]].name}** — ${(diff >= 0) ? `+${self.format(diff)}` : `-${self.format(-diff)}`}`
            }).slice(0, 30).join(`\n`) || 'empty lol'}`
        }
        self.client.channels.cache.get(self.getConfig("stonkUpdates")).send({embed: embed})
    },
    selfRoles: {},
    _venezuelaMode: false,
    get venezuelaMode() {
        return this.dataStuff.getData(`/`).venezuelaMode || false;
    },
    set venezuelaMode(value) {
        this.dataStuff.push(`/venezuelaMode`, value);
        var self = this;
        self._venezuelaMode = value;
        self.updateVenezuelaMode();
    },
    randomRange(min, max) {
        return min + Math.random() * (max - min)
    },
    mine(user, slot) {
        
        var s = require('./stuff');
        var shopItems = s.shopItems;
        var inv = s.db.getData(`/${user}/inventory`);
        if (shopItems[inv[slot].id].type == "Pickaxe") {
            var d = {...s.readItemData(user, slot)};
            var miningPower = d.miningPower || 1;
            s.writeItemData(user, slot, {durability: d.durability - (Math.random() * 10)});
            var items = [];
            
            Object.values(s.mineables).forEach(el => {
                if (Math.random() < el.chance && miningPower >= el.miningPower) {
                    var amount = Math.floor(s.clamp(Math.random() * el.maxAmount, el.minAmount, el.maxAmount) * (1 + (miningPower - el.miningPower)))
                    items.push({
                        id: el.id,
                        amount: amount,
                    })
                    
                    for (var i = 0; i < amount; i++) {
                        s.addItem(user, el.id)
                    }
                }
            })
            
            
            var newPick = {...s.readItemData(user, slot)};
            
            if (newPick.durability <= 0) {
                s.db.delete(`/${user}/inventory[${slot}]`);
            }
            var h = {
                items: items,
                pickaxe: newPick,
                oldPickaxe: d,
            }
            
            
            return h
        } else {
            throw new CommandError("<:v_:755546914715336765>", `How are you supposed to mine with \`${inv[slot].id}\`?`);
        }
    },
    _currencies: {
        "ip": {
            name: "Internet Points™️",
            propertyName: "points",
            icon: "<:ip:770418561193607169>",
            value: 1,
        },
        "gold": {
            name: "Gold",
            propertyName: "gold",
            icon: ":coin:",
            value: 100,
        },
        "sun": {
            name: "The Fucking Suns™️",
            propertyName: "suns",
            icon: "<:thefukinsun:819716692602781696>",
            value: 1000000000000,
        },
        "capacity": {
            name: "Item Capacity",
            propertyName: "maxItems",
            icon: "📦",
            value: 0,
        },
        "cheesy-way": {
            name: "Cheesy Ways™️",
            propertyName: "cheeseWays",
            icon: "🌌",
            value: 1000000000000000000,
        },
        "braincell": {
            name: "Braincells™️",
            propertyName: "braincells",
            icon: "🧠",
            value: 1000,
        },
        "unknown": {
            name: "Invalid currency",
            propertyName: "no",
            icon: "<:ohno:737474912666648688>",
            value: 0,
        }
    },
    currencies: {},
    getMoney(user, currency = "ip") {
        var h = this
        var cur = h.currencies[currency] || h.currencies.ip;
        return BigInt(h.clamp(parseInt(this.db.getData(`/${user}/`)[cur.propertyName] || 0), Number.MIN_VALUE / 2, Number.MAX_VALUE)) || 0n;
    },
    addMoney(user, amount, currency = "ip") {
        var stuff = require('./stuff')
        var cur = stuff.currencies[currency] || stuff.currencies.ip;
        var a = BigInt(Math.floor(amount) || 0);
        
        var h = stuff;
        if (a > 0n) stuff.db.push(`/${user}/${cur.propertyName}`, (h.getMoney(user, currency) + a).toString())
        else stuff.db.push(`/${user}/${cur.propertyName}`, (h.getMoney(user, currency) + a).toString())
    },
    eggscriptInterpreter: (message, phoneData, str = "", slot) => {
        var s = require('./stuff')
        var eggscriptInstructions = s.eggscriptInstructions
        if (!phoneData.vars) phoneData.vars = {}
        phoneData.vars.charge = phoneData.battery.charge
        phoneData.vars.batteryQuality = phoneData.battery.quality
        var instructions = str.split(';')
        for (phoneData.vars.line = 0;phoneData.vars.line < instructions.length;phoneData.vars.line = (Number(phoneData.vars.line) + 1) || 0) {
            var h = instructions[phoneData.vars.line]
            var _args = h.split(' ')
            var a = [];
            var cmd = _args.shift().trim().toLowerCase()
            _args.forEach((el, i) => {
                phoneData.vars.random = Math.random()
                
                Object.keys(phoneData.vars).forEach(v => {
                    var t = el.replace(RegExp(`var:${v}`, 'g'), phoneData.vars[v])
                    console.log(`${el}, var:${v}, ${t}`)
                    el = t
                })
                a[i] = el
            })
            console.log(a)
            console.log(eggscriptInstructions)
            eggscriptInstructions[cmd](message, a, phoneData, slot)
        }
    }
}
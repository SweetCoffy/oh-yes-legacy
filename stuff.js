const { Collection, Client } = require('discord.js');
const fs = require('fs');
const { resolve } = require('path');
const request = require('request');
const jsonDb = require('node-json-db');
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
        return JSON.stringify(require('./stuff').globalData.getData(args[0]), null, 4);
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
    purple: 0xf403fc // eggs
}
numeral.register('locale', 'test', {
    delimiters: {
        thousands: ' ',
        decimal: '.'
    },
    abbreviations: {
        thousand: 'k',
        million: 'M',
        billion: 'B',
        trillion: 'T'
    },
    ordinal : function (number) {
        return number === 1 ? '' : 's';
    },
    currency: {
        symbol: 'Internet Points'
    }
});
numeral.locale('test')



// extra stuff script


module.exports = {
    somehugenumber: 99999999,
    /**
     * @type Client
     */
    client: undefined,
    rarity: Rarity,
    db: new jsonDb.JsonDB("userdata", true, true, "/"),
    globalData: new jsonDb.JsonDB("datastuff", true, true, "/"),
    phoneCommands: new Collection(),

    funnyNumbers: [
        69,
        420
    ],
    /**
     * Calculates the rank value for the user
     * @param {string | object} user The user object / user id to caculate it's rank value
     */
    getRankValue: user => {
        if (typeof user != 'object') user = this.db.getData(`/${user}/`)
        
        return Math.floor(user.points + ((user.gold || 0) * 100) + (user.multiplierMultiplier || 1))
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

    define(word, i = 0) {
        return new Promise((resolve, reject) => {
            axios.default.get(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`).then(value => {
                var res = value.data.list[i]   
                //console.log(res); 
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
        "kicc": {
            name: "Kicc",
            id: "kicc",
            description: "ha ha yes you've been kicked",
            icon: "<:kicc:766778996330725376>"
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

    mineables: [
        {
            id: "rock",
            chance: 1,
            minAmount: 3,
            maxAmount: 50,
            miningPower: 1,
        },
        {
            id: "copper",
            chance: 0.9,
            minAmount: 1,
            maxAmount: 10,
            miningPower: 1,
        },
        {
            id: "titanium",
            chance: 0.6,
            minAmount: 1,
            maxAmount: 7,
            miningPower: 2,
        }
    ],



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
        return this.db.getData(`/${user}/`).gold || 0
    },

    addGold(user, amount) {
        if (!amount) return;
        this.db.push(`/${user}/gold`, this.getGold(user) + amount)
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
     * ##### note: spaces at the start of the string might be lost
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
        return this.clamp(this.db.getData(`/${user}/`).defense || 0, 0, Infinity);
    },

    addDefense(user, amount) {
        var a = amount || 0;
        this.db.push(`/${user}/defense`, this.getDefense(user) + a)
        console.log(`added ${a} (${amount}) defense to ${user}`)
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
        console.log(JSON.stringify(inv, null, 4));
        var hasItems = true;
        for (const el of it.ingredients) {
            var h = inv[el.id] || {amount: 0};
            console.log(h.amount);
            console.log(el.amount);
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
        var regex = /\[(\w+) *: *(.*)\]/gms;
        var matches = str.matchAll(regex);
        var s = this;

        
        for (const match of matches) {
            if (formatThings[match[1]] == undefined) continue;
            var replaceStr = "";
            try {
                replaceStr = formatThings[match[1]](match[2].split(",").map(v => s.stringThing(v.trimStart(), message)), message);
            } catch (err) {
                replaceStr = err.toString();
            }
            str = str.replace(/\[(\w+) *: *(.*)\]/, replaceStr);
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
     * Repeats `callback` `times` times asynchronously
     * @param {function(Number)} callback The code to repeat
     * @param {Number} times The amount of times to repeat `callback`
     * @returns {Promise<Number, Error | CommandError>} Promise for the completion of the loop
     */
    repeat (callback, times) {
        return new Promise(resolve => {
            var iterations = 0;
            try {
                for (var i = 0; i < times; i++) {
                    callback(i);
                    iterations++;
                }
                return resolve([iterations, undefined]);
            } catch (err) {
                console.log(err);
                return resolve([iterations, err]);
            }
        })
        

    },

    sendError (channel, err) {
        var _err = err;
        console.log(typeof err)
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
        var index = 0;
        for (var i = 0; i < arr.length; i++) {
            index += Math.random();
        }
        return arr[Math.floor(index)];
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
                multiplierMultiplier: 0.7,
                extraInfo: "Increases exponent",
                inStock: 999999999999999,
                rarity: Rarity.red,
                currency: "gold",
                price: 5000,
                icon: "🍰",
                name: "Cake",
                onUse(user) {
                    var stuff = require('./stuff')
                    stuff.addMultiplierMultiplier(user, 0.7);
                    stuff.removeItem(user, "cake")
                    return true;
                }
            },
            
            "full-cake": {
                type: "Consumable",
                multiplierMultiplier: 10,
                extraInfo: "Significantly increases exponent",
                inStock: 99999999999999999,
                price: 7500,
                currency: "gold",
                rarity: Rarity.pink,
                icon: "🎂",
                name: "Full Cake",
                onUse(user) {
                    var stuff = require('./stuff')
                    stuff.addMultiplierMultiplier(user, 10);
                    stuff.removeItem(user, "full-cake")
                    return true;
                }
            },
            "shield": {
                type: "Equipment",
                extraInfo: "Increases defense by 100 when equipped",
                inStock: 9999999999,
                rarity: Rarity.pink,
                price: 10000,
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
                    pointCount: 1000000000
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
                    stuff.addPoints(user, it.extraData.pointCount)
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
                onUse: function() {}
            },
            "battery": {
                name: "Battery",
                description: "ha ha yes another useless item",
                price: 1000,
                inStock: 999999,
                rarity: Rarity.green,
                extraData: {
                    charge: 100
                },
                icon: "🔋",
                onUse(user, _message, _args, slot) {
                    const stuff = require('./stuff')
                    var _slot = stuff.getInventory(user).map(el => el.id).indexOf('phone')
                    if (_slot < 0) return;
                    var data = stuff.readItemData(user, slot)
                    stuff.writeItemData(user, _slot, { battery: data })
                    stuff.removeItem(user, "battery")
                }
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
                onUse: function() {}
            },
            "car": {
                name: "Venezuela car",
                icon: "🚗",
                price: 1000000000000,
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
            "eggs": {
                name: `Eggs`,
                icon: "<:eggs:744607071244124230>",
                price: 1000000000,
                inStock: 999999999,
                addedMultiplier: 750000000,
                description: "Donate them to the Sky Egg Lord!",
                type: "Consumable",
                extraInfo: "Increases max health by 20 until 1.6k max health\nFully recovers health",
                rarity: Rarity.purple,
                onUse: function(user) {
                    const stuff = require('./stuff');
                    if (!(stuff.getMaxHealth(user) >= 1600)) stuff.db.push(`/${user}/maxHealth`, stuff.getMaxHealth(user) + 20)
                    stuff.userHealth[user] = stuff.getMaxHealth(user);
                    stuff.addMultiplier(user, 750000000)
                    stuff.removeItem(user, "eggs");
                    return true;
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
            "egg": {
                name: `Egg`,
                icon: ":egg:",
                price: 1000000,
                inStock: 999999999,
                rarity: Rarity.pink,
                addedMultiplier: 750000,
                description: "It's eggcellent!",
                extraInfo: "Summons the Egg Lord",
                type: "Consumable & Boss summon",
                onUse: function(user, message) {
                    const stuff = require('./stuff');
                    stuff.addMultiplier(user, 750000)
                    stuff.removeItem(user, "egg");
                    setTimeout(() => {
                        if (!stuff.currentBoss) {
                            stuff.currentBoss = {
                                name: "Egg Lord",
                                health: 2000,
                                drops: 100000000000000,
                                maxHealth: 2000,
                                itemDrops: ["eggs", "coin", "cake"],
                                fighting: [
                                    user
                                ]
                            }
                            message.channel.send("Egg Lord has awoken!")
                            
                        }
                    }, 1000)
                    return true;
                }
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
            "credit-card": {
                name: "Credit Card",
                icon: "💳",
                price: 5000,
                unstackable: true,
                inStock: 999999999,
                extraInfo: "It can hold moni",
                extraData: {
                    storedPoints: 5000,
                },
                rarity: Rarity.blue,
                onUse(user, message, args, slot) {
                    const stuff = require('./stuff')
                    var data = stuff.getInventory(user)[slot];
                    if (args[0] == "moni") {
                        message.channel.send(`Your credit card has ${stuff.format(data.extraData.storedPoints)} <:ip:770418561193607169>`);
                    } else if (args[0] == "pay") {
                        var amount = parseFloat(args[2])
                        if (args[2] == "all") amount = data.extraData.storedPoints
                        if (!amount) throw "e";
                        if (amount > data.extraData.storedPoints) throw "not enough moni"
                        var u = message.mentions.users.first();
                        if (!u) throw "you can't pay to void!"
                        stuff.addPoints(u.id, amount);
                        stuff.setItemProperty(user, slot, "storedPoints", stuff.getItemProperty(user, slot, "storedPoints") - amount)
                        message.channel.send(`You paid ${stuff.format(amount)} <:ip:770418561193607169> to ${u.username}`);
                    } else if (args[0] == "store") {
                        var amount = parseFloat(args[1])
                        if (args[1] == "all") amount = stuff.getPoints(user);
                        if (!amount) throw "e";
                        if (amount > stuff.getPoints(user)) throw "not enough moni"
                        stuff.addPoints(user, -amount)
                        stuff.setItemProperty(user, slot, "storedPoints", stuff.getItemProperty(user, slot, "storedPoints") + amount)
                        message.channel.send(`You stored ${stuff.format(amount)} <:ip:770418561193607169> in your credit card`)
                    }
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
                            itemDrops: ["eggs", "coin", "cake", "cake", "eggs", "egg", "coin", "cake", "life-drink", "life-drink", "full-cake", "shield", "diamond"],
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
                description: "Click for a free cookie!",
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
            "phone": {
                name: "Phone",
                icon: ":mobile_phone:",
                price: 5000,
                unstackable: true,
                inStock: 9999999999,
                rarity: Rarity.blue,
                type: "Other",
                description: "Remember to add that one package called `h`!",
                extraInfo: "Allows buying items from the shop at a cheaper price\nAllows submitting new phone commands",
                extraData: {
                    packages: [],
                    os: "Egg OS",
                    ver: 0.69, // phone version number, will be used in the future for command compatibility
                    verName: "0.69b"
                },
                onUse: function(user, message, args, slot) {
                    
                    const stuff = require('./stuff');
                    
                    var phoneData = stuff.getInventory(user)[slot].extraData || {};
                    var installedPackages = phoneData.packages || [];
                    
                    var u = message.guild.members.cache.get(user).user;

                    if (!phoneData.battery) throw "You need a battery!!!1!1!!1!!"
                    if (phoneData.battery.charge <= 0) {
                        stuff.writeItemData(user, slot, { battery: undefined })
                        throw "Your battery is dead!!!1111!!"
                    }


                    
                    var cmdName = args[0];
                    var _args = args.slice(1);

                    var cmd = stuff.phoneCommands.get(cmdName);
                    var b = stuff.readItemData(user, slot).battery
                    b.charge -= Math.random() * 2;

                    stuff.writeItemData(user, slot, { battery: b })

                    if (cmd.computerOnly) throw `You can only perform that command in a computer`

                    
                        
                    if (!cmd) {
                        throw `The command \`<base>/author unknown/${args[0]}\` is not available`;
                    } else {
                        if (!installedPackages.includes(cmd.package) && cmd.package != undefined) throw `The command \`${cmd.package || "unknown"}/${cmd.author || "author unknown"}/${cmd.name || "invalid-command"}\` is not available, use \`add ${cmd.package}\` and try again`;
                        if ((cmd.minVer || 1) < phoneData.ver) {
                            cmd.execute(message, _args, phoneData, slot);
                        } else {
                            throw `the command \`${cmd.name}\` requires version ${(cmd.minVer || 1).toFixed(1)} or newer, run \`update\` and try again`
                        }
                        
                    }
                    
                    
                    return false;
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
            "computer": {
                name: "Computer",
                icon: ":computer:",
                price: 10000,
                inStock: 9999999999,
                rarity: Rarity.red,
                type: "Other",
                unstackable: true,
                description: "Remember to add that one package called `h`!",
                extraInfo: "Better version of the phone",
                extraData: {
                    packages: [],
                    os: "Egg OS (Computer)",
                    ver: 2, // phone version number, will be used in the future for command compatibility
                    verName: "2b",
                    discs: []
                },
                onUse: function(user, message, args, slot) {
                    
                    const stuff = require('./stuff');
                    
                    var phoneData = stuff.getInventory(user)[slot].extraData || {};
                    var installedPackages = phoneData.packages || [];
                    
                    var u = message.guild.members.cache.get(user).user;


                    
                    var cmdName = args[0];
                    var _args = args.slice(1);

                    var cmd = stuff.phoneCommands.get(cmdName);

                    
                        
                    if (!cmd) {
                        throw `The command \`<base>/author unknown/${args[0]}\` is not available`;
                    } else {
                        if (!installedPackages.includes(cmd.package) && cmd.package != undefined) throw `The command \`${cmd.package || "unknown"}/${cmd.author || "author unknown"}/${cmd.name || "invalid-command"}\` is not available, use \`add ${cmd.package}\` and try again`;
                        if ((cmd.minVer || 1) < phoneData.ver) {
                            cmd.execute(message, _args, phoneData, slot);
                        } else {
                            throw `the command \`${cmd.name}\` requires version ${(cmd.minVer || 1).toFixed(1)} or newer, run \`update\` and try again`
                        }
                        
                    }
                    
                    
                    return false;
                }
            }
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
    
    loadPhoneCommands() {
        var s = require('./stuff')
        const commandFiles = fs.readdirSync('./phone-commands');
        for (const file of commandFiles) {
            
            
            delete require.cache[resolve(`./phone-commands/${file}`)]
            
            const command = require(`./phone-commands/${file}`);

            if (!s.validPackages.includes(command.package) && command.package != undefined) {
                s.validPackages.push(command.package);
            }
        
            
        
            s.phoneCommands.set(command.name, command);
        }
        
        
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
        var item = s.getEquipment(user)[slot]
        s.db.delete(`/${user}/equipment[${slot}]`);
        s.shopItems[item.id].onUnequip(user, slot)
        s.addItem(user, item);
    },

    getEquipmentSlots(user) {
        var s = require('./stuff')
        var user = s.db.getData(`/${user}/`)
        return user.equipmentSlots || 12;
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
        var r;
        var v = Math.abs(number);
        var prefix = "";
        // 1000000000000000000
        if (v > 999 && v < 999999) {
            r = (number / 1000) + options.k || "k";
            prefix = "k"
        } else if (v > 999999 && v < 999999999) {
            r = (number / 1000000) + options.m || "M";
            prefix = "M"
        } else if (v > 999999999 && v < 999999999999) {
            r = (number / 1000000000) + options.b || "B";
            prefix = "B"
        } else if (v > 999999999999 && v < 999999999999999){
            r = (number / 1000000000000) + options.t || "T";
            prefix = "T"
        } else if (v > 999999999999999 && v < 999999999999999999) {
            r = (number / 1000000000000000) + options.q || "q";
            prefix = "q"
        } else if (v > 999999999999999999 && v < 999999999999999999999) {
            r = (number / (999999999999999999 + 1)) + options.Q || "Q";
            prefix = 'Q'
        } else if (v > 999999999999999999999 && v < 999999999999999999999999) {
            r = (number / (999999999999999999999 + 1)) + options.s || "s";
            prefix = "s"
        } else if (v > 999999999999999999999999 && v < 999999999999999999999999999) {
            r = (number / (999999999999999999999999 + 1)) + options.S || "S";
            prefix = 'S'
        } else if (v > 999999999999999999999999999 && v < 999999999999999999999999999999) {
            r = (number / (999999999999999999999999999 + 1)) + options.O || "O";
            prefix = 'O'
        } else if (v > 999999999999999999999999999999) {
            r = (number / (999999999999999999999999999999999 + 1)) + options.N || "N";
            prefix = 'N'
        } else { 
            if (typeof number != 'number') {
                return "<invalid number>"
            } else if (!number && number != 0) {
                return "<invalid number>"
            }
            if (Math.floor(number) !== number) {
                r = number.toFixed(1);
            } else {
                r = number;
            }
        }

        var _r = parseFloat(r);

        if (Math.floor(_r) !== _r) {
            r = _r.toFixed(1) + prefix
        } else {
            r = _r + prefix
        }



        

        return r;
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
        var oldAmount = this.db.getData(` /${user}/multiplier`);
        this.db.push(` /${user}/multiplier`, this.db.getData(` /${user}/multiplier`) + amount)
        var newAmount = this.db.getData(` /${user}/multiplier`);
        console.log(`added ${(newAmount - oldAmount).toFixed(1)} multiplier to ${user}`)
    },
    addMultiplierMultiplier(user, amount) {
        this.db.push(` /${user}/multiplierMultiplier`, this.getMultiplierMultiplier(user) + amount)
    },

    addItem(user, item) {   
        var _item = item;
        if (typeof item == 'string') {
            var items = this.shopItems;
            _item = items[item];
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
    
    addPoints (user, amount) {

        

        console.log(`added ${amount || 0} to ${user}`)
        console.log(amount)
        this.db.push(`/${user}/points`, (this.db.getData(`/${user}/points`) || 0) + (amount || 0))
        

        
    },

    getPoints (user) {
        return this.db.getData(` /${user}/points`) || 0;
    },

    setPhoneVer (user, slot, ver, verName) {
        var items = this.db.getData(` /${user}/inventory/`);
        items[slot].extraData.ver = ver;
        items[slot].extraData.verName = verName;
        this.db.push(` /${user}/inventory`, items)
    },

    getConfig(setting) {
        var config = JSON.parse(fs.readFileSync("more-config.json").toString().replace("}}", "}"));
        

        if (config[setting] == undefined) {
            return true;
        }

        return config[setting];
    },

    set(setting, value) {
        var config = JSON.parse(fs.readFileSync("more-config.json").toString().replace("}}", "}"));
        config[setting] = value;

        fs.writeFileSync("more-config.json", JSON.stringify(config, undefined, 4).toString().replace("}}", "}"));
    },
    
    
    setPermission (user, perm, value) {
        this.db.push(` /${user}/permissions/${perm}`, value);
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
    
    getPermission(user, perm) {
        // return true if the user is me because reasons
        if (user == "602651056320675840") return true;
        try {
            var v = this.db.getData(` /${user}/permissions/${perm}`)
            return v;
        } catch (_e) {
            return false;
        }
        
    },
    mine(user, slot) {
        console.log(slot);
        var s = require('./stuff');
        var shopItems = s.shopItems;
        var inv = s.db.getData(`/${user}/inventory`);
        if (shopItems[inv[slot].id].type == "Pickaxe") {
            var d = {...s.readItemData(user, slot)};
            var miningPower = d.miningPower || 1;
            s.writeItemData(user, slot, {durability: d.durability - (Math.random() * 10)});
            var items = [];
            
            s.mineables.forEach(el => {
                if (Math.random() < el.chance && miningPower >= el.miningPower) {
                    var amount = Math.floor(s.clamp(Math.random() * el.maxAmount, el.minAmount, el.maxAmount) * (1 + (miningPower - el.miningPower)))
                    items.push({
                        id: el.id,
                        amount: amount,
                    })
                    console.log(el + ", " + amount)
                    for (var i = 0; i < amount; i++) {
                        s.addItem(user, el.id)
                    }
                }
            })
            console.log(items);
            console.log(d);
            var newPick = {...s.readItemData(user, slot)};
            console.log(newPick)
            if (newPick.durability <= 0) {
                s.db.delete(`/${user}/inventory[${slot}]`);
            }
            var h = {
                items: items,
                pickaxe: newPick,
                oldPickaxe: d,
            }
            
            console.log(h);
            return h
        } else {
            throw new CommandError("<:v_:755546914715336765>", `How are you supposed to mine with \`${inv[slot].id}\`?`);
        }
    },

}
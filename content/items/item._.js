var stuff = require('../../stuff')
var Rarity = stuff.rarity
stuff.shopItems = shopItems = {
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
            const stuff = require('../../stuff');
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
            var stuff = require('../../stuff')
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
            var stuff = require('../../stuff')
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
            var stuff = require('../../stuff')
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
            var stuff = require('../../stuff')
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
            var stuff = require('../../stuff')
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
            var stuff = require('../../stuff')
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
            var stuff = require('../../stuff')
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
            var stuff = require('../../stuff')
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
            var stuff = require('../../stuff')
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
        pageIcon: "https://discord.com/assets/ad2e4d6e7b90ca6005a5038e22b099cc.svg",
        onUse() {},
        onEquip(user) {
            var stuff = require('../../stuff');
            stuff.addDefense(user, 100)
        },
        onUnequip(user) {
            var stuff = require('../../stuff');
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
            var stuff = require('../../stuff')
            stuff.addMultiplierMultiplier(user, 50000000)
        },
        onUnequip(user) {
            var stuff = require('../../stuff')
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
            var stuff = require('../../stuff');
            stuff.addMultiplier(user, 10000000)
        },
        onUnequip(user) {
            var stuff = require('../../stuff');
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
            var stuff = require('../../stuff')
            var it = stuff.getInventory(user)[slot]
            stuff.addPoints(user, it.extraData.pointCount, `Used a coin`)
            stuff.removeItem(user, "coin")
            return true;
        }
    },  
    "life-drink": {
        type: "Consumable",
        extraInfo: "Increases max health",
        inStock: 99999999,
        rarity: Rarity.purple,
        currency: "gold",
        veModeExclusive: true,
        price: 10000,
        icon: "🥤",
        name: "Life Drink",
        onUse(user, _message, _args, slot) {
            var stuff = require('../../stuff')
            stuff.removeItem(user, "life-drink")
            stuff.userHealth[user] += 20
            stuff.addMaxHealth(user, 20)
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
            var stuff = require('../../stuff')
            stuff(user, 3)
        },
        onUnequip(user) {
            var stuff = require('../../stuff')
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
            var stuff = require('../../stuff')
            stuff.addAttack(user, 6)
        },
        onUnequip(user) {
            var stuff = require('../../stuff')
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
            var stuff = require('../../stuff')
            stuff.addAttack(user, 12)
        },
        onUnequip(user) {
            var stuff = require('../../stuff')
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
            
                const stuff = require('../../stuff');
                stuff.removeItem(user, "car");
                if (true) {
                    
                    // stuff.currentBoss = {
                    //     name: "Car Lord",
                    //     health: 50000,
                    //     drops: 1000000000000000000,
                    //     maxHealth: 50000,
                    //     damage: 350,
                    //     itemDrops: [
                    //         "cake",
                    //         "cake",
                    //         "coin",
                    //         "coin",
                    //         "milk",
                    //         "baguette",
                    //         "life-drink",
                    //         "diamond",
                    //         "shield"
                    //     ],
                    //     fighting: [
                    //         user
                    //     ]
                    // }
                    stuff.startBattle(user, stuff.enemies["car-lord"])
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
            const stuff = require('../../stuff');
            stuff.removeItem(user, "madkeanu");
            stuff.db.push(`/${user}/pets[]`, {
                name: "oO", 
                icon: "<:oO:749319330503852084>", 
                id: "oo", 
                food: "cookie",
                chonk: 150,
                maxChonk: 150,
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
            const stuff = require('../../stuff');
            stuff.removeItem(user, "router-alloy");
            stuff.db.push(`/${user}/pets[]`, {
                name: "Router", 
                icon: "<:router:739890062820638751>", 
                id: "router", 
                chonk: 75,
                baseMultiplierAdd: 1,
                maxChonk: 999,
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
            const stuff = require('../../stuff');
            stuff.removeItem(user, "web");
            stuff.db.push(`/${user}/pets[]`, {
                name: "Spider", 
                icon: ":spider:", 
                id: "spider", 
                chonk: 50,
                damage: 50,
                maxChonk: 150,
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
            const stuff = require('../../stuff');
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
            const stuff = require('../../stuff');
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
        pageIcon: "🧃",
        inStock: 99999999,
        type: "Consumable & Boss summon",
        description: "Dani said it was cringe, but they are now allies!",
        extraInfo: "Summons the Milk Gang",
        onUse: function(user, message) {
            const stuff = require('../../stuff');
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
        pageIcon: "🥛",
        description: "Dani likes it a lot!",
        onUse: function(user, message) {
            const stuff = require('../../stuff');
            stuff.addMultiplier(user, 4);
            stuff.addDefense(user, 0.001);
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
        pageIcon: "🥖",
        rarity: Rarity.blue,
        addedMultiplier: 10,
        description: "Thicc bread, but it's actually thicc in only one direction",
        onUse: function(user, message) {
            const stuff = require('../../stuff');
            stuff.addMultiplier(user, 10)
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
            const stuff = require('../../stuff');
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
}
module.exports = {
    name: "?",
    icon: "❔",
    description: "no"
}
const { Collection } = require('discord.js');
const fs = require('fs');

// extra stuff script


module.exports = {
    somehugenumber: 99999999,
    client: "",
    phoneCommands: new Collection(),
    funnyNumbers: [
        69,
        420
    ],

    validPackages: [
        "eggs"
    ],
    
    shopItems : {
            "spaghet": {
                name: "Spaghet",
                icon: ":spaghetti:",
                price: 75,
                inStock: 10,
                onUse: function(user) {
                    const stuff = require('./stuff');
                    stuff.addMultiplier(user, 1)
                    stuff.removeItem(user, "spaghet");
                    return true;
                }
            },
            "oo": {
                name: `Thicc v_`,
                icon: "<:oO:749319330503852084>",
                price: 50,
                inStock: 10,
                onUse: function(user) {
                    const stuff = require('./stuff');
                    stuff.addMultiplier(user, 0.5)
                    stuff.removeItem(user, "oo");
                    return true;
                }
            },
            "eggs": {
                name: `Eggs`,
                icon: "<:eggs:744607071244124230>",
                price: 3000,
                inStock: 10,
                onUse: function(user) {
                    const stuff = require('./stuff');
                    stuff.addMultiplier(user, 25)
                    stuff.removeItem(user, "eggs");
                    return true;
                }
            },
            "phone": {
                name: "Phone",
                icon: ":mobile_phone:",
                price: 700,
                inStock: 5,
                onUse: function(user, message, args, slot) {
                    
                    const stuff = require('./stuff');
                    
                    var phoneData = stuff.getInventory(user)[slot].extraData || {};
                    var installedPackages = phoneData.packages || [];
                    
                    var u = message.guild.members.cache.get(user).user;


                    
                    var cmdName = args[0];
                    var _args = args.slice(1);

                    var cmd = stuff.phoneCommands.get(cmdName);

                    
                        
                    if (!cmd) {
                        throw `The command \`<base>/${cmd.name}\` is not available`;
                    } else {
                        if (!installedPackages.includes(cmd.package) && cmd.package != undefined) throw `The command \`${cmd.package || "unknown"}/${cmd.name || "invalid-command"}\` is not available`;
                        cmd.execute(message, _args, phoneData);
                    }
                    
                    
                    return false;
                }
            }
    },

    emojis: {
        ohno: '737474912666648688',
        ohyes: '737493602011316326',
    },

    loadPhoneCommands() {
        const commandFiles = fs.readdirSync('./phone-commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./phone-commands/${file}`);
        
        
            this.phoneCommands.set(command.name, command);
        }
    },

    getMultiplier(user) {
        var data = JSON.parse(fs.readFileSync('userdata.json', 'utf8'));
        return (data[user] || {}).multiplier || 1;
    },

    getInventory(user) {
        var data = JSON.parse(fs.readFileSync('userdata.json', 'utf8'));
        return (data[user] || {}).inventory || [];
    },

    addPackage: function(user, slot, package) {  
        var data = JSON.parse(fs.readFileSync('userdata.json', 'utf8'));
        const stuff = require('./stuff');
        
        if (stuff.validPackages.includes(package)) {
            

            

            data[user].inventory[slot].extraData.packages.push(package);    
            fs.writeFileSync('userdata.json', JSON.stringify(data, undefined, 4).toString().replace("}}", "}"));
            resolve();

            

        } else {
            throw `could not find package \`${package}\``
        }
        
    },
    
    addMultiplier(user, amount) {
        var data = JSON.parse(fs.readFileSync('userdata.json', 'utf8'));
        if (data[user] == undefined) {
            require('./stuff').createData(user);
            return;
        }

        data[user].multiplier = (data[user].multiplier || 1) + amount;
        fs.writeFileSync('userdata.json', JSON.stringify(data, undefined, 4).toString().replace("}}", "}"));
    },

    addItem(user, item) {
        var data = JSON.parse(fs.readFileSync('userdata.json', 'utf8'));
        if (data[user] == undefined) {
            require('./stuff').createData(user);
            return;
        }

        if (data[user].inventory == undefined) {
            data[user].inventory = [];
        }

        data[user].inventory.push(item);
        fs.writeFileSync('userdata.json', JSON.stringify(data, undefined, 4).toString().replace("}}", "}"));
    },

    removeItem(user, itemName, count = 1) {
        var data = JSON.parse(fs.readFileSync('userdata.json', 'utf8'));
        if (data[user] == undefined) {
            require('./stuff').createData(user);
            return;
        }

        if (data[user].inventory == undefined) {
            data[user].inventory = [];
        }

        var inv = data[user].inventory;
        var times = 0;
        for (let i = 0; i < inv.length; i++) {
            const element = inv[i];
            if (element.id == itemName && times < count) {
                data[user].inventory.splice(i, 1);
                times++;
            }
        }
        fs.writeFileSync('userdata.json', JSON.stringify(data, undefined, 4).toString().replace("}}", "}"));
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
        fs.readFile("userdata.json", "utf8", function(err, d) {
            if (err){
                return console.log(err);
            }
            var data = JSON.parse(d.toString().replace("}}", "}"));

            if (data[user] == undefined) {
                return require('./stuff').createData(user);
                
            } else {
                data[user].points = (data[user].points || 0) + amount;
                fs.writeFile("userdata.json", JSON.stringify(data, undefined, 4).toString().replace("}}", "}"), function(err) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        })

        

        
    },

    getPoints (user) {
        var data = JSON.parse(fs.readFileSync("userdata.json", "utf8").replace("}}", "}"));
        return data[user].points || 0;
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
        var data = JSON.parse(fs.readFileSync("userdata.json").toString().replace("}}", "}"));

        if (value == "false") {
            value = false;
        } else if (value == "true") {
            value = true;
        } else {
            value = true;
        }
        
        if (!data[user]) {
            data[user] = {
                xp: 0,

                level: 1,

                xpNeeded: 100,

                inventory: [{name: "Phone", id: "phone", icon: ":mobile_phone:"}],
                
                permissions: {

                }
            }
        }

        
        data[user].permissions[perm] = value;

        fs.writeFileSync("userdata.json", JSON.stringify(data, undefined, 4).toString().replace("}}", "}"));
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
    
    createData: function(user) {

        if (fs.existsSync("userdata.json")) {
            var data = JSON.parse(fs.readFileSync("userdata.json", 'utf8').toString().replace("}}", "}"));
            if (!data[user]) {
                data[user] = {
                    xp: 0,

                    level: 1,

                    xpNeeded: 100,

                    points: 0,

                    multiplier: 1,

                    inventory: [{name: "Phone", id: "phone", icon: ":mobile_phone:"}],
                    
                    permissions: {
    
                    }
                }
            }
            

            fs.writeFileSync("userdata.json", JSON.stringify(data, undefined, 4).toString().replace("}}", "}"));
        } else {
            
            var data = {

            }

            data[user] = {
                xp: 0,

                level: 1,

                xpNeeded: 100,

                points: 0,

                multiplier: 1,

                inventory: [{name: "Phone", id: "phone", icon: ":mobile_phone:"}],
                
                permissions: {

                }
            }
            
            fs.writeFileSync("userdata.json", JSON.stringify(data, undefined, 4).toString().replace("}}", "}"));
        }
        
        

    },

    string2bool(str) {
        if (str == "true") return true;
        if (str == "false") return false;
        return undefined;
    },
    
     getPermission(user, perm) {

        if ( fs.existsSync("userdata.json") ) {
            
            const data = JSON.parse(fs.readFileSync("userdata.json", 'utf8').toString().toString().replace("}}", "}"));

            if (data[user]) {

                return data[user].permissions[perm];

            } else {
                return false;
            }

        } else {
            this.createData(user);
            return false;
        }

    }
    

}
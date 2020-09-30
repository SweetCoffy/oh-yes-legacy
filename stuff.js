const fs = require('fs');

// extra stuff script


module.exports = {
    somehugenumber: 99999999,
    client: "",
    funnyNumbers: [
        69,
        420
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
                name: `Thicc ${require('./stuff').getConfig("oO")}`,
                icon: ":spaghetti:",
                price: 75,
                inStock: 10,
                onUse: function(user) {
                    const stuff = require('./stuff');
                    stuff.addMultiplier(user, 1)
                    stuff.removeItem(user, "spaghet");
                    return true;
                }
            }
    },

    emojis: {
        ohno: '737474912666648688',
        ohyes: '737493602011316326',
    },

    getMultiplier(user) {
        var data = JSON.parse(fs.readFileSync('userdata.json', 'utf-8'));
        return (data[user] || {}).multiplier || 1;
    },

    getInventory(user) {
        var data = JSON.parse(fs.readFileSync('userdata.json', 'utf-8'));
        return (data[user] || {}).inventory || [];
    },
    
    addMultiplier(user, amount) {
        var data = JSON.parse(fs.readFileSync('userdata.json', 'utf-8'));
        if (data[user] == undefined) {
            require('./stuff').createData(user);
            return;
        }

        data[user].multiplier = (data[user].multiplier || 1) + amount;
        fs.writeFileSync('userdata.json', JSON.stringify(data));
    },

    addItem(user, item) {
        var data = JSON.parse(fs.readFileSync('userdata.json', 'utf-8'));
        if (data[user] == undefined) {
            require('./stuff').createData(user);
            return;
        }

        if (data[user].inventory == undefined) {
            data[user].inventory = [];
        }

        data[user].inventory.push(item);
        fs.writeFileSync('userdata.json', JSON.stringify(data));
    },

    removeItem(user, itemName) {
        var data = JSON.parse(fs.readFileSync('userdata.json', 'utf-8'));
        if (data[user] == undefined) {
            require('./stuff').createData(user);
            return;
        }

        if (data[user].inventory == undefined) {
            data[user].inventory = [];
        }

        var inv = data[user].inventory;
        var i = 0;
        inv.forEach(element => {
            if (element.id == itemName) {
                data[user].inventory.splice(i)
            }
            i++;
        })
        fs.writeFileSync('userdata.json', JSON.stringify(data));
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
            var data = JSON.parse(d);

            if (data[user] == undefined) {
                return require('./stuff').createData(user);
                
            } else {
                data[user].points = (data[user].points || 0) + amount;
                fs.writeFile("userdata.json", JSON.stringify(data, undefined, 4), 'utf8', function(err) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        })

        

        
    },

    getPoints (user) {
        var data = JSON.parse(fs.readFileSync("userdata.json", "utf8"));
        return data[user].points || 0;
    },

    getConfig(setting) {
        var config = JSON.parse(fs.readFileSync("more-config.json"));
        

        if (config[setting] == undefined) {
            return true;
        }

        return config[setting];
    },

    set(setting, value) {
        var config = JSON.parse(fs.readFileSync("more-config.json"));
        config[setting] = value;

        fs.writeFileSync("more-config.json", JSON.stringify(config, undefined, 4));
    },
    
    
    setPermission (user, perm, value) {
        var data = JSON.parse(fs.readFileSync("userdata.json"));

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
                
                permissions: {

                }
            }
        }

        
        data[user].permissions[perm] = value;

        fs.writeFileSync("userdata.json", JSON.stringify(data, undefined, 4));
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
            var data = JSON.parse(fs.readFileSync("userdata.json", 'utf8'));
            if (!data[user]) {
                data[user] = {
                    xp: 0,

                    level: 1,

                    xpNeeded: 100,

                    points: 0,

                    multiplier: 1,
                    
                    permissions: {
    
                    }
                }
            }
            

            fs.writeFileSync("userdata.json", JSON.stringify(data, undefined, 4));
        } else {
            
            var data = {

            }

            data[user] = {
                xp: 0,

                level: 1,

                xpNeeded: 100,

                points: 0,

                multiplier: 1,
                
                permissions: {

                }
            }
            
            fs.writeFileSync("userdata.json", JSON.stringify(data, undefined, 4));
        }
        
        

    },

    string2bool(str) {
        if (str == "true") return true;
        if (str == "false") return false;
        return undefined;
    },
    
     getPermission(user, perm) {

        if ( fs.existsSync("userdata.json") ) {
            
            const data = JSON.parse(fs.readFileSync("userdata.json", 'utf8'));

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
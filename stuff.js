const fs = require('fs');

// extra stuff script


module.exports = {
    somehugenumber: 99999999,
    funnyNumbers: [
        69,
        420
    ],

    emojis: {
        ohno: '737474912666648688',
        ohyes: '737493602011316326',
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
    
    addXp (user, amount) {
        var data = JSON.parse(fs.readFileSync("userdata.json"));
        data[user].xp = (data[user].xp || 0) + amount;
    },

    getXp (user) {
        var data = JSON.parse(fs.readFileSync("userdata.json"));
        return data[user].xp || 0;
    },

    getLevel(user) {
        var data = JSON.parse(fs.readFileSync("userdata.json"));

        return data[user].level || 1;

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
    
    
    
    
     createData (user) {

        if (fs.existsSync("userdata.json")) {
            var data = fs.readFileSync("userdata.json");
            if (!data[user]) {
                data[user] = {
                    xp: 0,

                    level: 1,

                    xpNeeded: 100,
                    
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
                
                permissions: {

                }
            }
            
            fs.writeFileSync("userdata.json", JSON.stringify(data, undefined, 4));
        }
        
        

    },
    
     getPermission(user, perm) {

        if ( fs.existsSync("userdata.json") ) {
            
            const data = JSON.parse(fs.readFileSync("userdata.json"));

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
const fs = require('fs');

module.exports = {
    name: "error",
    description: "shows info about an error code thing",
    usage: "error [code]",

    execute(message, args) {
        var errorcodes = {
            "42069": "Chat revive attempt failed",
            "420": "Nice",
            "69": "Nice",
            "666": "oh no",
            "h": "hhhhh",
            "EggNotFoundException": "Could not find field `Egg` in <@630489464724258828>",
            "PingNotFoundException": "Could not find field `Ping` in <undefined>"
        }

        var errorcode = args[0];
        var err;

        if (!errorcode) {
            var entries = Object.entries(errorcodes);
            errorcode = entries[Math.floor(Math.random() * entries.length)][0];
            err = errorcodes[errorcode];
        } else {
            err = errorcodes[errorcode];
        }

        message.channel.send(`${errorcode}: ${errorcodes[errorcode]}`);
    }
}
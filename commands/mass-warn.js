const stuff = require("../stuff")
var { createHash } = require("crypto")
module.exports = {
    name: "mass-warn",
    category: "moderation",
    requiredPermission: "mass-warn",
    useArgsObject: true,
    arguments: [
        {
            name: "user",
            type: "user"
        },
        {
            name: "count",
            type: "int"
        }
    ],
    async execute(message, args) {
        var warns = stuff.db.data[args.user.id].warns;
        args.count = stuff.clamp(args.count, 1, 10000);
        var msg = await message.channel.send(`Adding warns...`)
        function massWarn() {
            var chars = ["|", "/", "-", "\\"]
            var counter = 0;
            var edit = true;
            return Promise.resolve().then(async() => {
                for (var x = 0; x < args.count; x++) {
                    console.log(`Iteration ${x} started`)
                    if (x % 1000 == 0 & edit) {
                        try {await msg.edit(`Adding warns... ${chars[stuff.clamp((counter % chars.length) - 1, 0, chars.length - 1)]} (${((x / args.count) * 100).toFixed(1)}%)`)} catch (_e) {edit = false}
                        counter++;
                    } 
                    var user = args.user;
                    var data = {
                        date: Date.now(),
                        reason: i + "",
                        randomNumber: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
                    }
                    var json = JSON.stringify(data);
                    var n = 0;
                    var number = BigInt(Date.now()) % (2n ** 20n);
                    var warnHash = createHash("sha256", json).digest('hex');
                    var userHash = createHash("sha256", user.id + user.username + user.tag + user.flags).digest("hex");
                    for (var i = 0; i < json.length; i++) {
                        n += (json.charCodeAt(i) >> i % 16 * userHash.charCodeAt(5) + userHash.charCodeAt(6) + warnHash.charCodeAt(7) + warnHash.charCodeAt(6)) % (data.randomNumber / 512) % 7;
                        number += BigInt(json.charCodeAt(i) % parseInt(userHash.slice(0, 2), 16) >> i) % 7n
                    }
                    n = Math.floor(n)
                    number += BigInt(n);
                    var code = number.toString(16);
                    data.code = code;
                    delete data.randomNumber;
                    warns.push(data);
                    console.log(`Iteration ${x} done`)
                }
                stuff.db.data[args.user.id].warns = warns;
            })
        }
        await massWarn();
        await msg.edit(`Added ${args.count} warns to ${args.user.username}`)
    }

}
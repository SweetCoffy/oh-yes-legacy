const CommandError = require("../CommandError");
const stuff = require("../stuff");

module.exports = {
    name: "unwarn",
    description: "unwarns somebody lolololololo",
    usage: "unwarn <warn code>",
    requiredPermission: "commands.unwarn",
    execute (message, args) {
        var code = args[0];
        var reason = args.slice(1).join(" ");
        if (!code) throw CommandError.undefinedError;
        var warns = stuff.globalData.getData(`/warns/`);
        var warn = warns[code];
        if (!warn) throw new CommandError("Warn not found", `Could not find warn code \`${code}\``);
        stuff.globalData.delete(`/warns/${code}`);
        var index;
        var filtered = stuff.db.getData(`/${warn.user}/warns`).filter((v, i) => {
            if (v.code == code) {
                index = i;
            } 
            return v.code == code;
        })[0]
        stuff.db.delete(`/${warn.user}/warns[${index}]`);
        var embed = {
            title: "warn removed succesfully",
            description: `removed warn \`${code}\` from <@${warn.user}>`,
            fields: [
                {
                    name: "warn reason",
                    value: warn.reason
                },
                (args.length > 1) ? {name: "unwarn reason", value: reason} : undefined
            ]
        }

        message.channel.send({embed: embed})

    }
}
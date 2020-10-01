const stuff = require('../stuff');

module.exports = {
    name: "list",
    execute(message, args, phoneData) {
        var mode = "commands"

        if (args[0] != undefined) mode = args[0];
        
        if (mode == "commands") {
            var cmdNames = [];
            var available = stuff.phoneCommands.filter((v, k) => {
                return phoneData.packages.includes(v.package) || v.package == undefined;
            });
    
            available.forEach(el => {
                cmdNames.push(`\`${(el.package || "<base>")}/${el.name}\``);
            })
    
            var embed = {
                title: "phone command list",
                description: cmdNames.join("\n")
            }
            message.channel.send({embed: embed});
        } else if (mode == "packages" || mode == "pkgs") {
            var pkgNames = [];
            stuff.validPackages.forEach(el => {
                pkgNames.push("`" + el + "`");
                var embed = {
                    title: "phone command list",
                    description: pkgNames.join("\n")
                }
            })
        } else {
            throw `list mode \`${mode}\` not found`
        }
    }
}
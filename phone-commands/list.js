const stuff = require('../stuff');

module.exports = {
    name: "list",
    minVer: 0.0001,
    execute(message, args, phoneData) {
        var mode = "commands"

        if (args[0] != undefined) mode = args[0];
        
        if (mode == "commands") {
            var cmdNames = [];
            var available = stuff.phoneCommands.filter((v, k) => {
                return phoneData.packages.includes(v.package) || v.package == undefined;
            });
    
            available.forEach(el => {
                cmdNames.push(`\`${(el.package || "<base>")}/${el.author || "author unknown"}/${el.name}\` ${((el.minVer || 1) <= phoneData.ver) ? "" : `(requires version ${el.minVer || 1} or newer)`}`);
            })
    
            var embed = {
                title: "phone command list",
                description: cmdNames.join("\n")
            }
            message.channel.send({embed: embed});
        } else if (mode == "packages" || mode == "pkgs") {
            var pkgNames = [];
            stuff.validPackages.forEach(el => {
                var pkgCommands = stuff.phoneCommands.filter(el => el.package == el).length;
                
                pkgNames.push(`\`${el}\`, +${pkgCommands}`);

            })
            var embed = {
                title: "phone packages list",
                description: pkgNames.join("\n"),
                footer: {
                    text: "add <package name> to add a package lol"
                }
            }
            message.channel.send({embed: embed})
        } else {
            throw `list mode \`${mode}\` not found`
        }
    }
}
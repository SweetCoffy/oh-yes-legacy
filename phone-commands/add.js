const stuff = require('../stuff');

module.exports = {
    name: "add",
    minVer: 0.001,
    execute (message, args, phoneData, slot) {
        
        var pkg = args[0];
        if (phoneData.packages.includes(pkg)) throw `could not add \`${pkg}\`: you already have it lol`
        stuff.addPackage(message.author.id, slot, pkg);
        var cmdNames = [];
        stuff.phoneCommands.filter(el => el.package === pkg).forEach(el => {
            
            
            
            cmdNames.push(`+ \`${el.package}/${el.author || "author unknown"}/${el.name}\``);
        })
        var embed = {
            title: `Package \`${pkg}\` added successfully!`,
            description: `${cmdNames.join("\n")}`
        }
        message.channel.send({embed: embed});

    }
}
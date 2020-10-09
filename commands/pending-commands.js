const stuff = require("../stuff")

module.exports = {
    name: "pending-commands",
    description: "shows a list of phone commands that haven't been approved lolololol",

    execute(message, args) {
        var cmdNames = []
        var cmds = stuff.getPendingCommands();
        cmds.forEach(cmd => {
            cmdNames.push(`\`${cmd.package || "<base>"}/${cmd.author || "author unknown"}/${cmd.name}\``)
        })

        var embed = {
            title: "pending command list",
            description: cmdNames.join("\n"),
        }
        message.channel.send({embed: embed});
    }
}
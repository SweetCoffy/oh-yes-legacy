module.exports = {
    name: "add-impostor",
    requiredPermission: "commands.add-impostor",

    execute (message, args) {
        var user = message.mentions.users.first();
        var client = message.client;
        

        

        if (args[0] == "everyone") {
            message.guild.members.fetch().then(members => {

                members.forEach(member => {
                    if (!client.impostors.includes(member.user.id))
                        client.impostors.push(member.user.id);
                })

                
                // wait a bit before deleting the message because yes
                setTimeout(() => {
                    message.delete();
                }, 1000)
                
                
                
                
                
            }).then(() => {
            })

            return;
        }
        
        if (!user) {
            user = { id: args[0]};
        }

        if (args.length < 1) {
            throw "***no***";
        }

        if (client.impostors.includes(user.id)) {
            throw "***no***";
        }

        client.impostors.push(user.id);
        message.delete();
    }
}
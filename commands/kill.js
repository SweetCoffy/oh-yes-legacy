module.exports = {
    name: "kill",

    execute (message, args) {
        if (message.guild.id == '758148217434669057') {

            var member = message.mentions.members.first();

            if (member) {
                if (member.user.id == message.author.id) {
                    throw "you can't kill yourself";
                }
                
                if (!message.client.impostors.includes(message.author.id)) {
                    message.author.send("you aren't an impostor").catch(err => {
                        console.log(err);
                    });
                    return;
                } else {
                    var client = message.client;

                    var i = 0;
                    client.impostors.forEach(im => {
                        if (im == member.user.id) {
                            client.impostors.splice(i, 1);
                        }
                        
                        i++;
                    })
                    client.channels.cache.get('758156322494742538').send({
                        embed: {
                            color: 0xff0000,
                            title: "someone got killed",
                            description: `${member.user} got stabbed by ${message.author}`}
                        }).then(msg => {
                        member.kick(`got stabbed`);
                    });
                    
                    member.user.send(`you got stabbed by ${message.author.id}`).catch(err => {
                        console.log(err);
                    })
                }
            }

        } else {
            throw `That command is disabled on the server **${message.guild.name}** because reasons`;
        }
    }
}
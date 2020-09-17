module.exports = {
    name: "impostor",

    execute (message, args) {
        var client = message.client;
        var user = client.users.cache.get(args[0]) || message.mentions.users.first();

        if (!user) {
            throw "***no***";
        }

        if (client.currentVoting) {
            if (!client.currentVoting.ended) {
                throw "there is still a vote active!";
            }
        }

        message.channel.send({embed: {
            title: 'vOtE aLerT!',
            description: `${message.author} voted, **1/${client.requiredVotes}**`
        }});
        client.currentVoting = {
            msg: message,
            user: user,
            votes: 1,
            ended: false,
            timer: setTimeout(() => {
                message.channel.send(`${message.client.voteTimeout} seconds passed, the vote will be automatically cancelled`);
                this.ended = true;
            }, message.client.voteTimeout * 1000),
            voters: [
                message.author.id
            ],
            vote(asUser) 
            {   
                if (this.voters.includes(asUser.id)) {
                    throw "you can't vote twice!";
                }
                
                this.votes++;
                
                
                this.voters.push(asUser.id);
                this.msg.channel.send({embed: {
                    title: 'vOtE aLerT!',
                    description: `${asUser} voted, **${this.votes}/${this.msg.client.requiredVotes}**`
                }})
                if (this.votes >= this.msg.client.requiredVotes) {
                    if (this.msg.client.impostors.includes(this.user.id)) {
                        var client = this.msg.client;
                        var i = 0;
                        client.impostors.forEach(element => {
                            if (element == this.user.id) {
                                client.impostors.splice(i, 1);
                            }
                            
                            i++;
                        })
                        this.msg.channel.send(`${this.user} was an impostor, **${this.msg.client.impostors.length}** impostors left`);
                        this.ended = true;
                        clearTimeout(this.timer);
                    } else {
                        this.msg.channel.send(`${this.user} was not an impostor, **${this.msg.client.impostors.length}** impostors left`);
                        this.ended = true;
                        clearTimeout(this.timer);
                    }
                }
            }
        };

        

    }
}
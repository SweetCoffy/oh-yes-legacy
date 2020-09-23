class Vote {
    msg;
    user;
    votes = 0;
    ended = false;
    timer;
    voters = [];

    vote(asUser) 
    {   
        var guild = this.msg.guild;
        if (this.voters.includes(asUser.id)) {
            throw "you can't vote twice!";
        }

        if (asUser.id == this.user.id) {
            throw "you can't vote yourself off!";
        }

        if (this.ended) {
            throw "this vote already ended!";
        }
        
        this.votes++;
        
        
        this.voters.push(asUser.id);
        this.msg.channel.send({embed: {
            title: 'vOtE aLerT!',
            description: `${asUser} voted, **${this.votes}/${this.msg.client.requiredVotes}**`
        }})
        var embed = {
                    
        }
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

                if (client.impostors.length < 1) {
                    embed.title = "victory";
                } else {
                    embed.title = `${client.impostors.length} remaining`;
                }

                embed.description = `${this.user} was an impostor`;



                
                this.msg.channel.send({embed: embed});
                this.ended = true;
                clearTimeout(this.timer);

                try {
                    if (guild.id == '758148217434669057') {
                        guild.members.cache.get(this.user.id).kick("got voted off, was an impostor").then(member => {
                            this.msg.channel.send(`${member.user} got voted off, was an impostor`);
                        })
                    }
                } catch (err) {
                    console.log(err);
                }
            } else {

                var client = this.msg.client;
                
                embed.title = `${client.impostors.length} remaining`;


                

                embed.description = `${this.user} was *not* an impostor`;


                
                this.msg.channel.send({embed: embed});
                this.ended = true;
                clearTimeout(this.timer);
                try {
                    if (guild.id == '758148217434669057') {
                        guild.members.cache.get(this.user.id).kick("got voted off, was not an impostor").then(member => {
                            this.msg.channel.send(`${member.user} got voted off, was not an impostor`);
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }

    constructor(msg, user) {
        this.msg = msg;
        this.user = user;
        this.timer = setTimeout(() => {
            this.msg.channel.send(`${this.msg.client.voteTimeout} seconds passed, the vote will be automatically cancelled`);
            this.ended = true;
            
        }, this.msg.client.voteTimeout * 1000)

        this.vote(msg.author);
    }
}

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



        client.currentVoting = new Vote(message, user);

        

    }
}
module.exports = {
    name: "vote",

    execute (message) {
        var client = message.client;
        
        if (client.currentVoting) {
            client.currentVoting.vote(message.author);
        } else {
            throw "there's nothing to vote";
        }
    }
}
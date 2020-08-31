module.exports = {
    name: "kick",
    usage: "kick <member:guildmember>",
    requiredPermission: "commands.kick",

    execute(message, args) {
        const member = message.mentions.members.first();

        if (member) {

            var reason = args;

            reason.shift();


            
            member.kick(reason.join(" ")).then(() => {
                message.channel.send("succesfully kicked " + member.displayName + ", reason: " + (reason.join(" ") || "none") );
            }).catch (error => {
                throw error;
            })

        } else {
            throw "you must mention a member";
        }
    }
}
const stuff = require("../stuff");

module.exports = {
    name: "say",
    requiredPermission: "commands.say",
    usage: "say <text:string>",

    execute (message, args, extraArgs) {
        
        // questionable error message
        if (args.length < 1 && extraArgs.length < 1) {
            throw "not enough arguments";
        }



        // join the stuff
        var cont = stuff.stringThing(args.join(" ")).replace(/(<|)[@!&]\S*(>|)/gm, `<@${message.author.id}>`);

        
        
        if (extraArgs[0] == "embed") {
            var oldCont = cont;

            cont = {embed: JSON.parse(extraArgs[1]), content: oldCont};
        }
        

        // actually sending the message
        message.channel.send(cont).then(() => {
            message.delete();
        })
    }
}
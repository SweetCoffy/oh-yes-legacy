const stuff = require("../stuff");

module.exports = {
    name: "say",
    requiredPermission: "commands.say",
    usage: "say <text:string>",

    execute (message, args, _extraArgs, extraArgs) {
        
        // questionable error message
        if (args.length < 1 && Object.keys(extraArgs).length < 1) {
            throw "not enough arguments";
        }

        var embed = {
            title: stuff.stringThing(extraArgs.title || "", message),
            description: stuff.stringThing(extraArgs.description || "", message),
            thumbnail: {
                url: extraArgs.thumbnailUrl,
                width: parseInt(extraArgs.thumbnailWidth),
                height: parseInt(extraArgs.thumbnailHeight)
            },
            footer: {
                text: extraArgs.footer,
            },
            image: {
                url: extraArgs.imageUrl,
                width: parseInt(extraArgs.imageWidth),
                height: parseInt(extraArgs.imageHeight)
            }
        }


        // join the stuff
        var cont = stuff.stringThing(args.join(" ").replace(/(<|)[@!&]\S*(>|)/gm, `<@${message.author.id}>`), message);

        
        
        if (extraArgs.embed) {
            var oldCont = cont;

            try {
                cont = {embed: JSON.parse(extraArgs.json), content: oldCont};
            } catch (_e) {
                cont = {embed: embed, content: oldCont}
            }
        }
        

        // actually sending the message
        message.channel.send(cont).then(() => {
            message.delete();
        })
    }
}
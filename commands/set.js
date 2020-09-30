const stuff = require('../stuff')

module.exports = {
    name: "set",
    requiredPermission: "commands.set",
    description: "sets a config value",
    usage: "set <setting:string> <value:any>",

    execute (message, args, extraArgs) {

        var didConvert = false;
        
        var unconvertedVal = args.slice(1).join(" ");

        var val = unconvertedVal;
        
        var conversions = 
        {
            "Bool": stuff.string2bool,
            "Int": parseInt,
            "Float": parseFloat,
            "StringArray": stuff.string2stringArray,
            "Object": JSON.parse
        }
        
        if (stuff.string2bool(unconvertedVal) != undefined) {
            val = stuff.string2bool(unconvertedVal);
            didConvert = true;
        }

        if (extraArgs.length > 0) {
            var regex = /as(.*)/
            var convertTo = regex.exec(extraArgs[0])[1];
    
            
            if (conversions[convertTo] != undefined) {
                val = (conversions[convertTo])(unconvertedVal);
                didConvert = true;
            } else {
                throw `could not find conversion: \`${convertTo}\``
            }
        }
        

        

        

        stuff.set(args[0], val);

        
        var embed = {
            title: `set \`${args[0]}\` to \`${val}\``,
        }

        if (didConvert) {
            embed.description = `(converted to \`${(typeof val).toString()}\`)`
        }


        
        message.channel.send({embed: embed});

    }
}


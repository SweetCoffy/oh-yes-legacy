module.exports = {
    name: "spam",
    usage: "spam <count:int> <text:string>",
    requiredPermission: "commands.spam",

    execute(message, args) {

        var count = parseInt(args[0]);
        var _args = args;

        _args.shift();

        if (isNaN(count)) {
            throw "invalid type";
        }

        for (let i = 0; i < count; i++) {
            
            message.channel.send (_args.join(" "));
            
        }




    }
}
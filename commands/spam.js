module.exports = {
    name: "spam",
    usage: "spam <count:int> <text:string>",
    requiredPermission: "commands.spam",

    execute(message, args) {

        var count = parseInt(args[0]);
        var _args = args;

        _args.shift();

        // check if the count is a valid number
        if (isNaN(count)) {
            throw "`count` must be of type integer";
        }

        // loop
        for (let i = 0; i < count; i++) {
            
            message.channel.send (_args.join(" "));
            
        }




    }
}
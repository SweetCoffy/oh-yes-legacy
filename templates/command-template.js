module.exports = {
    
    // required, must be the same as the file name without the extension
    name: "command-template",
    
    
    // ignore for a placeholder description "<eggs>" to show up in the command help
    description: "desription goes here", 

    // ignore for the command name to show up in the usage
    usage: "command usage goes here",
    
    // ignore to make the command be accessible by everyone
    requiredPermission: "command's required permission",

    execute(message, args) {
        // command code goes here
    }
}
const Command = require("./Command");
const { Message } = require("discord.js");
const CommandError = require("./CommandError");
const stuff = require("./stuff");
/**
 * An actual permissions based command
 */
module.exports = class RestrictedCommand extends Command {
    requiredRolePermissions
    /**
     * 
     * @param {string} name 
     * @param {function(Message, string[]?)} onExecute 
     * @param {string} requiredPermission 
     * @param {string} description 
     */
    constructor(name, onExecute, requiredPermission, description = "<eggs>") {
        super(name, onExecute, "", description);
        this.requiredRolePermissions = requiredPermission;
    }
    /**
     * Runs the command
     * @param {Message} message 
     * @param {string[]} args 
     */
    execute(message, args, extraArgs, extraArgsObject) {
        var guild = message.guild;
        var member = message.member;
        var hasPermissions = member.permissions.has(this.requiredRolePermissions, {checkAdmin: true});
        if (hasPermissions) {
            this.onExecute(message, args, extraArgs, extraArgsObject)
        } else {
            throw new CommandError("Missing permissions", `You need the ${stuff.thing(stuff.snakeToCamel(this.requiredRolePermissions.toLowerCase()))} permission to use this command`)
        }
    }
}
const { Message } = require("discord.js");
const { threshold } = require("jimp");

/**
 * Base class for the class based command handler
 */
module.exports = class Command {
    type = "Command"
    /**
     * The command's name
     */
    name;
    usage;
    cooldown = 1;
    /**
     * Description shown on the command's help embed
     */
    description;
    arguments = [];
    /**
     * Required permission for the oh yes permission system, should be `commands.<command name>`
     */
    requiredPermission;
    onExecute = () => {}
    /**
     * 
     * @param {string} name 
     * @param {function(Message, string[]?)} onExecute 
     * @param {string} requiredPermission 
     * @param {string} description 
     */
    constructor(name, onExecute, requiredPermission, description = "<eggs>") {
        this.name = name;
        this.onExecute = onExecute;
        this.description = description;
        this.requiredPermission = requiredPermission;
    }
    static create(name) {
        return new Command(name)
    }
    setDescription(str) {
        this.description = str;
        return this;
    }
    setExecute(func) {
        this.onExecute = func;
        return this;
    }
    /**
     * Runs the command
     * @param {Message} message 
     * @param {string[]} args 
     */
    execute(message, args, extraArgs, extraArgsObject) {
        this.onExecute(message, args, extraArgs, extraArgsObject)
    }
    setProperty(name, value) {
        this[name] = value;
        return this;
    }
    /**
     * 
     * @param {string| {name: "h", type: "string", optional: false, default: "h", validValues: ["h"]}} name 
     * @param {string} type 
     * @param {bool} optional 
     * @param {string} defaultValue 
     * @param {string[]} validValues 
     */
    addArgument(name = undefined, type = "string", optional = false, defaultValue = "", validValues = undefined) {
        if (typeof name == "object") {
            this.arguments.push(name)
        } else {
            this.arguments.push({
                type: type,
                name: name,
                optional: optional,
                default: defaultValue,
                validValues: validValues
            })
        }
        return this;
    }
    argsObject() {
        this.useArgsObject = true;
        return this;
    }
}   
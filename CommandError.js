/**
 * Represents a command error lol
 */
class CommandError {
    /**
     * The error name
     */
    name;
    /**
     * The error message
     */ 
    message;
    /**
     * The error footer
     */
    footer;

    /**
     * Returns a string representation of a CommandError
     */
    toString() {

    }

    /**
     * @param {String} name The error name
     * @param {String} message The error message
     */
    constructor(name, message, footer = undefined) {
        this.name = name;
        this.message = message;
        this.footer = footer;
        
    }
    /**
     * Returns a discord embed representation of a CommandError
     */
    toEmbed() {
        var embed ={
            title: this.name,
            color: 0xff0000,
            description: this.message,
        }  
        if (this.footer) {
            embed.footer = {
                text: this.footer,
            }
        }
        return embed;
    }
    /**
     * Intentional error message, i use it when i'm too lazy to make an actual one
     */
    static undefinedError = new CommandError("undefined", "undefined", "[intentional bot design]"); 
    static fromString(str) {
        return new CommandError("Command Error", str);
    }
    
}

module.exports = CommandError;



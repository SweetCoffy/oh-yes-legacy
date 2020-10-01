  
class CommandError extends Error {
    
    constructor(ebmsg) {
        this.name = "Command Failed to execute"
        super("Reason: " + ebmsg)
    }
}
module.exports = CommandError

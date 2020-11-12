const Command = require("./Command")
const { Collection } = require('discord.js');
const CommandError = require("./CommandError");
const stuff = require("./stuff");
// don't ask why it is unfinished
module.exports = class SubcommandCommand extends Command {
    get arguments() {
        return undefined
    }
    /**
     * The command's subcommands collection
     * @type Collection<String, Command>
     */
    subcommands = new Collection();
    constructor (name, subcommands, description) {
        super(name, () => {}, '', description)
        var h = this;
        subcommands.forEach(el => {
            var merged = {...el, parent: this, execute: ((el.constructor || {}).prototype || {}).execute || function(...args) {this.onExecute(...args)}}
            this.subcommands.set(el.name, merged)
        })
    }
    execute (message, args, _extraArgs, extraArgs) {
        var subcmdName = args.shift()
        if (!subcmdName) return
        var subcmds = this.subcommands;
        
        var subcmd = subcmds.get(subcmdName)
        if (subcmd) {
             subcmd.execute(message, stuff.argsThing(subcmd, args, message), extraArgs);
        } else {
            throw new CommandError(`Invalid subcommand`, `The valid subcommands are: ${subcmds.map(el => `**${el.name}**`).join(", ")}`)
        }
    }
}
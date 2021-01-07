const Command = require("./Command")
const { Collection } = require('discord.js');
const CommandError = require("./CommandError");
const { resolve } = require('path')
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
            if (typeof el == 'object') {
                var merged = {...el, parent: this, execute: ((el.constructor || {}).prototype || {}).execute || function(...args) {this.onExecute(...args)}}
                this.subcommands.set(el.name, merged)
            } else if (typeof el == 'string') {
                delete require.cache[resolve(`./commands/${name}/${el}.js`)]
                var h = require(resolve(`./commands/${name}/${el}.js`))
                var merged = {...h, parent: this, execute: ((h.constructor || {}).prototype || {}).execute || function(...args) {this.onExecute(...args)}}
                this.subcommands.set(h.name, merged)
            }
        })
    }
    execute (message, args, _extraArgs, extraArgs) {
        var subcmdName = args.shift()
        if (!subcmdName) return
        var subcmds = this.subcommands;
        var subcmd = subcmds.get(subcmdName)
        if (subcmd) {
            if (subcmd.requiredPermission) {
                var hasPermission = stuff.getPermission(message.author.id, subcmd.requiredPermission, message.guild.id) || stuff.getPermission(message.author.id, '*', message.guild.id);
                if (!hasPermission) throw new CommandError("Missing permissions", `The subcommand \`${subcmd.name}\` requires the \`${subcmd.requiredPermission}\` permission`);
            }
            subcmd.execute(message, stuff.argsThing(subcmd, args, message), extraArgs);
        } else {
            throw new CommandError(`Invalid subcommand`, `The valid subcommands are: ${subcmds.map(el => `**${el.name}**`).join(", ")}`)
        }
    }
}
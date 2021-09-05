var args = process.argv.slice(2);
var h = args.join(" ");
var hh = "";
for (var i = 0; i < h.length; i++) {
    hh += String.fromCharCode(h.charCodeAt(i) | (h.charCodeAt(i + 1) || h.charCodeAt(0)));
}
console.log(hh);
var c = require('console');
var console = new c.Console({ stdout: process.stdout, stderr: process.stderr });
client.ws.removeAllListeners('INTERACTION_CREATE');
client.ws.on('INTERACTION_CREATE', async interaction => { 
    var c = client.slashCommands.get(interaction.data.name)
    var obj = {}
    function makeArgsObject(args, obj) {
        for (var p of args) {
            if (p.options?.length > 0) {
                obj[p.name] = {};
                makeArgsObject(p.options, obj[p.name]);
            } else {
                obj[p.name] = p.value;
            }
        }
    }
    if (interaction.data.options?.length > 0) makeArgsObject(interaction.data.options, obj)
    c.execute(client.api.interactions[interaction.id][interaction.token], interaction, obj)
})

var handler = { get(target, prop) { 
    if (prop == 'toString') return () => target.p;
    if (typeof prop != 'string') return target[prop]
    return new Proxy({p: `${target.p}${prop}/`}, handler) 
} }; 
var p = new Proxy({ p: "/" }, handler);
p.eggs.are.yes + ""

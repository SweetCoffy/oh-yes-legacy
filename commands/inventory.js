const { color } = require('jimp');
const stuff = require('../stuff');
const colors = [
    0x34c3eb,
    0x34ebb7,
    0x34eb52,
]

module.exports = {
    name: "inventory",
    description: "shows the items you currently have",
    useArgsObject: true,
    category: "economy",
    aliases: ["items", "where-are-my-fucking-items", "inv"],
    arguments: [
        {
            name: "page",
            type: "number",
            description: "The page of the inventory to show",
            optional: true,
            default: 1,
        },
    ],
    execute(message, args, _extraArgs, extraArgs) {
        var authorId = message.author.id;
        var useCompact = !extraArgs.disableStacking;
        var _inv = stuff.getInventory(authorId);
        var u = stuff.db.data[authorId]
        var b = null
        var boxStacking = extraArgs.boxStacking;
        var max = u.maxItems;
        if ((typeof u.target == "number") && u.inventory[u.target]?.id == "box" && !extraArgs.inv) {
            b = u.target;
            _inv = u.inventory[u.target].extraData.items
            if (!extraArgs.noBoxStacking) boxStacking = true;
            max = stuff.BOX_CAPACITY
        }
        var page = stuff.clamp((args.page) - 1, 0, 999999);
        var startFrom = 0 + (20 * page);
        if (extraArgs.sort) {
            var vals = {}
            var keys = Object.keys(stuff.shopItems).sort()
            for (var i = 0; i < keys.length; i++) {
                vals[keys[i]] = i
            }
            _inv.sort((a, b) => vals[a?.id] - vals[b?.id])
        }
        if (_inv.length < 1) {
            throw "you don't have any items in your inventory!"
        } else {
            var itemNames = [];
            var h = arr => {
                var obj = {};
                var iter = 0;
                arr.forEach(el => {
                    var h = obj[el.id];
                    var i = el.id
                    if (stuff.shopItems[i]?.stackable == false) i += iter
                    if (!h) obj[i] = {amount: 0, ...el}
                    obj[i].amount++
                    iter++;
                })
                return Object.values(obj);
            } 

            if (boxStacking) {
                h = arr => {
                    var obj = [];
                    for (var i = 0; i < arr.length; i++) {
                        var itm = arr[i]
                        var last = obj[obj.length - 1]
                        if (!last || last.id != itm.id || (stuff.shopItems[itm.id]?.stackable == false)) {
                            obj.push(last = {amount: 0, i, ...itm})
                        }
                        last.amount++;
                    }
                    return obj;
                } 
            }
           
            var inv = useCompact ? h(_inv) : _inv;
            
            if (!inv.forEach) {
                var oldInv = Object.create(inv);
                inv = [oldInv]
            }
            if (useCompact) {
                if ((inv[0] || {}).id != _inv[0].id) {
                    inv.unshift(_inv[0])
                }
            }
            
            

            inv.slice(startFrom, startFrom + 20).forEach((item, i) => {
                itemNames.push(`${(item.i != undefined) ? `\`#${item.i}\` ` : ""}${(item.amount != 1 && item.amount) ? `${item.amount}x ` : `${item.amount ? '' : `\`${i}\` `}`}${item.icon} \`${item.id}\` ${item.name} ${stuff.shopItems[item.id].getInvInfo?.(item) || ""}`);
            });
            
            var embed = {
                title: (typeof b == "number") ? `#${b} ${stuff.db.data[message.author.id].inventory[b].name}` : "Inventory",
                color: colors[0],
                description: itemNames.join("\n"),
                footer: {
                    text: `Page ${page + 1}/${Math.floor(inv.length / 20) + 1}, Items: [${stuff.bar(_inv.length, max, 20, {padding: "　"})}] ${stuff.format(_inv.length)}/${stuff.format(max)}`
                }
            }

            if (Math.random() < 0.07 || stuff.getCheats(message.author.id)['ivetory']) {
                embed.title = "Ivetory"
                embed.fields = [{ name: "cool", value: "you just found an easter egg" }]
                if (stuff.eastereggs['ivetory']?.onTrigger) stuff.eastereggs['ivetory']?.onTrigger(message)
            }
            if (extraArgs.oldStacking) {
                embed.color = colors[1]
                embed.title = "Inventory (old version)"
            }
            if (!useCompact) {
                embed.color = colors[2]
                embed.title = "Inventory (oldest version)"
            }
            message.channel.send({embed: embed});
        }
    }
}
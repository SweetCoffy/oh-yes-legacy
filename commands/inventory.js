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
    arguments: [
        {
            name: "page",
            type: "number",
            description: "The page of the inventory to show",
            optional: true,
            default: 1,
        }
    ],
    execute(message, args, _extraArgs, extraArgs) {
        var authorId = message.author.id;
        var useCompact = !extraArgs.disableStacking;
        var _inv = stuff.getInventory(authorId);
        var page = stuff.clamp((args.page) - 1, 0, 999999);
        var startFrom = 0 + (20 * page);

        
        if (_inv.length < 1) {
            throw "you don't have any items in your inventory!"
        } else {
            var itemNames = [];
            /**
             * 
             * @param {object[]} acc 
             * @param {object} curr 
             * @param {number} i 
             */
            var reducer = (acc, _curr, i) => {
                var curr = Object.create(_inv[i]) || Object.create(_curr);
                
                if (!stuff.shopItems[curr.id].unstackable && curr.id == (acc[(acc.length || 0) - 1] || {}).id) {
                    var h = Object.create(acc[acc.length - 1]);
                      if (!h.amount) h.amount = 1;
                      h.amount += curr.amount || 1
                      var index = acc.map(el => el.id).lastIndexOf(curr.id);
                      var includes = acc.map(el => el.id).includes(curr.id)
                      if (!includes) {
                          return [...((acc.push != undefined) ? acc : []), h];
                      } else {
                          var a = acc
                          a[index] = h;
                          return a;
                      }
                      
                } else {
                    var h = Object.create(_curr);
                    curr.i = i;
                    return [...((acc.push != undefined) ? acc : []), h];
                }
                
            }

            var h = arr => {
                var obj = {};
                arr.forEach(el => {
                    var h = obj[el.id];
                    if (!h) obj[el.id] = {amount: 0, ...el}
                    obj[el.id].amount++
                })
                return Object.values(obj);
            } 
           
            var inv = useCompact ? h(_inv) : _inv;
            if (extraArgs.oldStacking) inv = _inv.reduce(reducer);
            
            if (!inv.forEach) {
                var oldInv = Object.create(inv);
                inv = [oldInv]
            }
            if (useCompact) {
                if ((inv[0] || {}).id != _inv[0].id) {
                    inv.unshift(_inv[0])
                }
            }
            
            

            inv.forEach((item, i) => {
                itemNames.push(`${(item.amount != 1 && item.amount) ? `${item.amount}x ` : `${item.amount ? '' : `\`${i}\` `}`}${item.icon} \`${item.id}\` ${item.name}`);
            });
            
            var embed = {
                title: "Inventory",
                color: colors[0],
                description: itemNames.slice(startFrom, startFrom + 20).join("\n"),
                footer: {
                    text: `Page ${page + 1}/${Math.floor(inv.length / 20) + 1}, You currently have ${stuff.format(_inv.length)} / ${stuff.format(stuff.getMoney(message.author.id, 'capacity'))} items`
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
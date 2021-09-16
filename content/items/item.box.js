var stuff = require('../../stuff.js');
module.exports = {
    name: "Box",
    icon: "📦",
    stackable: false,
    extraData: {
        items: []
    },
    price: 9999,
    getInvInfo(itm) {
        return `(${itm.extraData.items.length} Items)`
    },
    onUse(user, msg, args, slot) {
        var a = args.shift()
        if (a == "take") {
            var inv = stuff.getInventory(user)
            var i = inv[slot];
            var s = Number(args.shift()) || 0
            var a = Math.clamp(Number(args.shift()) || 1, 1, inv.length)
            for (var i_ = 0; i_ < a; i_++) {
                var it = i.extraData.items[s]
                if (it) {
                    inv.push(it)
                } else throw ``;
                i.extraData.items.splice(s, 1)
            }
        } else if (a == "select") {
            if (stuff.db.data[user].target == slot) {
                stuff.db.data[user].target = null;
            } else stuff.db.data[user].target = slot;
        } else if (a == "name") {
            stuff.db.data[user].inventory[slot].name = `Box (${args.join(" ")})`
        } else if (a == "store") {
            var inv = stuff.getInventory(user)
            var it = inv[slot]
            var s = Number(args.shift()) || 0
            var am = stuff.clamp(Number(args.shift()) || 1, 1, inv.length)
            for (var i = 0; i < am; i++) {
                var e = inv[s]
                it.extraData.items.push(e)
                inv.splice(s, 1)
            }

        }
    },
}
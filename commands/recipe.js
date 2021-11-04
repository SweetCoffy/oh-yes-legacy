const { MessageAttachment } = require("discord.js");
const stuff = require("../stuff");

module.exports = {
    name: "recipe",
    useArgsObject: true,
    arguments: [
        {
            name: "item",
            type: "string"
        }
    ],
    execute(msg, { item }) {
        var e = stuff.craftables[item]
        if (!e) throw "the fucking"
        var noncraftables = {}
        function tree(recipe, depth = 0, amt = 1) {
            var str = ""
            if (depth == 0) {
                str += stuff.itemP(recipe.id, 1, true) + "\n"
                depth++;
            }
            for (var i of recipe.ingredients) {
                str += "|---".repeat(depth) + stuff.itemP(i.id, i.amount * recipe.amount, true) + "\n"
                if (stuff.craftables[i.id]) {
                    str += tree({...stuff.craftables[i.id], amount: i.amount}, depth + 1)
                } else {
                    if (!noncraftables[i.id]) noncraftables[i.id] = 0
                    noncraftables[i.id] += recipe.amount * i.amount
                }
            }
            return str;
        }
        var t = `${tree({...e, amount: 1})}\nBase items required:\n${Object.entries(noncraftables).map(el => stuff.itemP(el[0], el[1], true)).join("\n")}`
        if (t.length > 1500) {
            msg.channel.send({ files: [new MessageAttachment(Buffer.from(t), "the.txt")] })
            return
        }
        msg.channel.send(`\`\`\`${t}\`\`\``)
    }
}
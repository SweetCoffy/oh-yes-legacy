const stuff = require("../stuff");

module.exports = {
    name: "sc",
    aliases: ["social-credit", "social-credits", "socialcredit", "socialcredits"],
    arguments: [
        {
            type: "user",
            optional: true,
            default: "me",
            name: "user",
        }
    ],
    useArgsObject: true,
    execute(msg, args) {
        var fill = ["🟥", "🟧", "🟨", "🟩"]
        var min = -600;
        var max = 600;
        var up = "🔼"
        var bg = "⬛";
        var width = 10;
        function bar(v, w) {
            var str = ""
            str += `\`${min.toString().padEnd(6, " ")}\` `
            var c = 0;
            var g = Math.floor(v * w)
            while (c < w) {
                c++;
                str += fill[Math.min(Math.floor((c / w) * fill.length), fill.length - 1)]
            }
            c = 0;
            str += ` \`${max.toString().padStart(6, " ")}\``
            str += "\n"
            str += `\`      \` `
            var funi = []
            while (funi.length < width) {
                funi.push(bg)
            }
            funi[Math.floor(v * funi.length)] = up
            funi = funi.slice(0, w)
            str += funi.join("")
            str += ` \`      \``
            return str;
        }
        function raeng(v, min, max) {
            return (v - min) / (max - min)
        }
        var u = args.user;
        var sc = Number(stuff.getMoney(u.id, "social-credit") + "")
        msg.reply(`${u} has ${sc} social credit\n${bar(raeng(sc, min, max), width)}`)
    }
}
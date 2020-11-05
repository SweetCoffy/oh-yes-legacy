module.exports = {
    name: "h",
    execute(message, args) {
        var h = args.join(" ") || "";
        var regex = /<(\w+)\b[^>]*>(.*)<\/\1>/gms
        var parseThing = (str = "") => {
            var obj = {};
            var matches = str.matchAll(regex)
            for (const match of matches) {
                console.log(match[1] + ":" + match[2])
                if (regex.test(match[2])) {
                    obj[match[1]] = parseThing(match[2])
                } else {
                    obj[match[1]] = match[2]
                }
            }
            return obj;
        }
        var json = JSON.stringify(parseThing(h), null, 4)
        message.channel.send(`\`\`\`JSON\n${json}\n\`\`\``);
    }
}
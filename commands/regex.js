module.exports = {
    name: "regex",
    supportsQuoteArgs: true,
    useArgsObject: true,
    description: "Test a string against a regular expression",
    category: "",
    arguments: [
        {
            name: "regex",
            type: "string",
            description: "The regular expression to use"
        },
        {
            name: "testString",
            type: "string",
            description: "The string to test the regular expression against"
        },
        {
            name: "flags",
            type: "string",
            description: "The flags for the regular expression",
            optional: true,
            default: "g"
        }
    ],
    execute(message, args) {
        var regex = RegExp(args.regex, args.flags || "g")
        var matches = [...args.testString.matchAll(regex)]
        var embed = {
            title: "Test results",
            description: `${args.testString.replace(regex, "**$&**")}`,
            fields: matches.map((v, i) => { return { inline: true, name: `Match #${i + 1}`, value: `${v.map((v, i) => `${(i == 0) ? `Full match` : `Capturing group #${i}`}: ${v}`).join("\n")}` } })
        }
        message.channel.send({embed: embed})
    }
}
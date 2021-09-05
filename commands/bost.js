module.exports = {
    name: "bost",
    description: "Make a thicc boost bar because yes",
    useArgsObject: true,
    arguments: [
        {
            name: "length",
            type: "positiveInt",
            optional: true,
            default: 0,
            description: `The amount of <:bost4:842853096076869682> to add, maximum is 70`,
        },
        {
            name: "type",
            type: "int",
            optional: true,
            default: 0,
            description: `The type of boost bar\n0: Sonic Generations but above maximum or something\n1: Sonic Generations\n2: Sonic Forces\nany other number: <:v_:755546914715336765>`
        }
    ],
    category: "useless",
    cooldown: 5,
    async execute(message, args) { 
        if (args.length > 70) throw `how about no`
        var types = [
            {
                start: ["<:bost1:842853098128539708>", "<:bost2:842853096857665566>", "<:bost3:842853097071443998>"], 
                fill: "<:bost4:842853096076869682>", 
                end: ["<:bost5:842853096588574751>"]
            },
            {
                start: ["<:bost1:842914922991190047>", "<:bost2:842914923876319292>"],
                fill: "<:bost3:842914923976720404>",
                end: ["<:bost4:842914923964530760>"]
            },
            {
                //<:bost1:842921209830440961> <:bost2:842921210152747038> <:bost3:842921210269794314>    <:bost4:842921210316324875>     <:bost5:842921210337296384>
                start: ["<:bost1:842921209830440961>", "<:bost2:842921210152747038>", "<:bost3:842921210269794314>"],
                fill: "<:bost4:842921210316324875>",
                end: ["<:bost5:842921210337296384>"]
            }
        ]
        var type = types[args.type] || { start: ["<:v_:755546914715336765>"], fill: "🟨", end: ["<:_v:823258737451073556>"] }
        await message.channel.send(`${type.start.join("")}${type.fill.repeat(args.length)}${type.end.join("")}`);
    }
}
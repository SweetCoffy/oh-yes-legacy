module.exports = {
    name: "allocunsafe",
    requiredPermission: "commands.allocunsafe",
    useArgsObject: true,
    arguments: [{ name: "size", type: "int" }],
    execute(message, args) {
        var b = Buffer.allocUnsafe(args.size);
        var vals = [...b];
        message.channel.send({content: `Output (bytes): ${vals.map(el => el.toString(16).padStart(2, "0")).join(" ")}\n\nOutput (text): ${b.toString()}`, code: true, split: true})
    }
}
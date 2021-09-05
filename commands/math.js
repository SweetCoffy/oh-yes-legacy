module.exports = {
    name: "math",
    useArgsObject: true,
    description: "Does math",
    arguments: [ { name: "op", type: "string", description: "The operations to do, any invalid characters will be ignored" } ],
    execute(message, args, _a, extraArgs) {
        var validTokens = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '*'];

        var type = Number;
        if (extraArgs.bigInt) type = BigInt;
        var debug = extraArgs.debug;
        var operators = { '+': (a, b) => a + b, '*': (a, b) => a * b, '**': (a, b) => a ** b };
        function parse(str = "") {
            var op = Object.entries(operators).find(el => str.split(el[0]).length > 1)
            str = str.trim();
            var fnRegex = /(\w+)\((.+?)\)/g;
            var m = str.match(fnRegex);
            
            if (m) {
                if (debug) message.channel.send(`${m[0]}, ${m[1]}, ${m[2]}`)
                return Math[m[1]]?.(...m[2].split(",").map(el => parse(el)))
            } else if (Math[str]) return Math[str]
            else if (op) {
                var e = str.split(op[0])
                return op[1](parse(e[0]), parse(e.slice(1).join(op[0])))
            } else return type(str);
        }
        message.channel.send(`${parse(args.op)}`);
    }
}
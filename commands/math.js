module.exports = {
    name: "math",
    useArgsObject: true,
    description: "Does math",
    arguments: [ { name: "op", type: "string", description: "The operations to do, any invalid characters will be ignored" } ],
    execute(message, args, _a, extraArgs) {
        var validTokens = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '*'];
        var numberCharEnd = 10;
        var type = Number;
        if (extraArgs.bigInt) type = BigInt;
        var debug = extraArgs.debug;
        var operators = { '+': (a, b) => a + b, '*': (a, b) => a * b };
        var tokens = "";
        for (var i = 0; i < args.op.length; i++) {
            if (validTokens.includes(args.op[i])) tokens += args.op[i];
        }
        var curResult = 0;
        var leftNum, rightNum;
        leftNum = rightNum = 0;
        var left = '';
        var right = '';
        var lastOp = '';
        var mode = 'left';
        if (debug) message.channel.send(`${tokens}`)
        for (var i = 0; i < tokens.length; i++) {
            var c = tokens[i];
            var isLastChar = i == (tokens.length - 1);
            var idx = validTokens.indexOf(c);
            if (debug) message.channel.send(`${c} in \`${mode}\` mode`)
            if (mode == 'left') {
                if (idx > numberCharEnd || isLastChar) {
                    if (!isLastChar) lastOp = c;
                    leftNum = type(left);
                    if (debug) message.channel.send(`Left: ${leftNum} (${left})`);
                    left = "";
                    right = "";
                    mode = 'right'
                } else {
                    left += c;
                    if (debug) message.channel.send(`Appended ${c} to \`left\``)
                }
            } else if (mode == 'right') {
                if (idx > numberCharEnd) {
                    if (!isLastChar) lastOp = c;
                    rightNum = type(right);
                    if (debug) message.channel.send(`Right: ${rightNum} (${right})`);
                    right = "";
                    mode = 'left'
                } else {
                    right += c;
                    if (debug) message.channel.send(`Appended ${c} to \`right\``)
                }
            }
            if (isLastChar) {
                rightNum = type(right)
                if (debug) message.channel.send(`${lastOp}(${leftNum}, ${rightNum})`)
                curResult = operators[lastOp](leftNum, rightNum)
            }
        }
        message.channel.send(`${curResult}`);
    }
}
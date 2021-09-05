module.exports = {
    name: "8ball",
    useArgsObject: true,
    arguments: [ { name: "question", type: 'string' } ],
    execute(message, args) {
        var answers = ["don't even think about it", "don't", 'no', 'maybe', '{numbah}%', 'yes']
        var n = 0;
        for (var i = 0; i < args.question.length; i++) {
            n += args.question.charCodeAt(i) * (i + 1)
        }
        if (args.question.includes('am') && args.question.includes('mogus')) n = 0;
        var a = answers[n % (answers.length)].replace("{numbah}", ((n % 1000) / 10) + "")
        console.log(n % (answers.length))
        message.channel.send({embed: { title: args.question, description: a }})
    }
}
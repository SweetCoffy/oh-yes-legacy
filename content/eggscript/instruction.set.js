module.exports = (message, args, phoneData) => {
    var h = args.shift()
    phoneData.vars[h] = args.join(" ")
}
module.exports = (str) => {
    var stuff = require('../../stuff')
    var prefixes = stuff.formatOptions.number.map(el => el.suffix.trim())
    str = str + ""
    var match = str.match(/([\d.-]+) *(\w*)/);
    if (match == null) return undefined;
    var number = parseFloat(match[1] || "0")
    var prefix = match[2] || "";
    var multiplier = Math.pow(10, stuff.clamp(prefixes.indexOf(prefix) * 3, 0, Infinity))
    return number * multiplier;
}
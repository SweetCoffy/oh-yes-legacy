module.exports = (str) => {
    var timeThings = { m: 60, h: 60 * 60, s: 1 };
    var r = /(\d+)([A-z]*)/g;
    var h = [...str.matchAll(r)];
    var totalTime = 0;
    for (var match of h) {
        var n = Number(match[1]) || 0;
        var l = match[2];
        totalTime += n * (timeThings[(l || "").toLowerCase()] || timeThings["s"])
    }
    return totalTime * 1000;
}
var args = process.argv.slice(2);
var h = args.join(" ");
var hh = "";
for (var i = 0; i < h.length; i++) {
    hh += String.fromCharCode(h.charCodeAt(i) | (h.charCodeAt(i + 1) || h.charCodeAt(0)));
}
console.log(hh);

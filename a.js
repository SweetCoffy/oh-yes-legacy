function compress(data = new Uint8Array()) {
    var result = []
    var cur = -1;
    var last = -1;
    var counter = 0;
    for (var byte of data) {
        if (last != byte) {
            last = byte
            counter = 0;
            cur++
        }
        if (last == byte) counter++
        result[cur * 2] = counter
        result[cur * 2 + 1] = byte
        if (counter >= 255) {
            counter = 0;
            last = -1
        }
    }
    return new Uint8Array(result)
}
function decompress(data = new Uint8Array()) {
    var result = []
    var counter = 0;
    for (var i = 0; i < data.length; i += 2) {
        for (var x = 0; x < data[i]; x++) {
            result[counter + x] = data[i + 1]
        }
        counter++
    }
    return new Uint8Array(result)
}
var h = compress(new Uint8Array(1024))
console.log(h)
console.log(decompress(h))
var { parentPort, workerData } = require('worker_threads');
var finished = false;
var error;
var buff = Buffer.alloc(Math.min(workerData.bufferSize ?? 30000, 30000));
var ptr = 0
var code  = workerData.code.split('').filter(el => [".", "<", ">", "+", "-", ",", "[", "]"].includes(el)).join("")
function jumpToClosingBracket() {			
    var depth = 1;
    var openingBracketPosition = ptr;
    ptr += 1;
    while(ptr < code.length) {					
        switch(code[ptr]) {
            case "[":
                depth += 1;
                break;
            case "]":
                depth -= 1;
                if(depth == 0) {
                    ptr += 1;							
                    return;
                }
                break;
            default:							
                break;
        }
        ptr += 1;
    }				
}
function jumpToOpeningBracket() {		
    var depth = 1;
    var closingBracketPosition = ptr;
    ptr -= 1;
    while(ptr >= 0) {					
        switch(code[ptr]) {
            case "]":
                depth += 1;
                break;
            case "[":
                depth -= 1;
                if(depth == 0) {
                    ptr += 1;							
                    return;
                }
                break;
            default:							
                break;
        }
        ptr -= 1;
    }				
}
(async function() {
    try {
        /**
         * @type {String}
         */
        for (var i = 0; i < code.length; i++) {
            var h = code[i]
            switch (h) {
                case '.':
                    parentPort.postMessage({ type: 'print', char: buff.readInt8(ptr) })
                break;
                case ',':
    
                    break;
                case '<':
                    ptr--
                    if (ptr < 0) ptr = buff.length - 1
                    break;
                case '>':
                    ptr++
                    if (ptr >= buff.length) ptr = 0
                    break;
                case '+':
                    buff.writeInt8(buff.readInt8(ptr) + 1, ptr)
                    break;
                case '-':
                    buff.writeInt8(buff.readInt8(ptr) - 1, ptr)
                    break;
                case '[':
                    var d = buff.readInt8(ptr)
                    if (d == 0) {
                        jumpToClosingBracket()
                    }
                    break;
                case ']':
                    var d = buff.readInt8(ptr)
                    if (d != 0) {
                        jumpToOpeningBracket()
                    }
                    break;
                default:
                    break;
            }
        }
    } catch (er) {
        error = er
        finished = true
    }
})()
while (!finished) {}
if (error) {
    parentPort.postMessage({ type: "end", buffer: [...buff] })
    throw error;
}
parentPort.postMessage({ type: "end", buffer: [...buff] })
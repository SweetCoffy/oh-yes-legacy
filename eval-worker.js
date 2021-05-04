const { workerData, parentPort } = require('worker_threads')
var vm2 = require('vm2')
var stream = require('stream');
const { Console } = require('console');
var { inspect } = require('util')
parentPort.on('message', d => {
    try {
        var str = ""
        class EvalConsoleOutput extends stream.Writable {
            write(...args) {
                str += args[0];
                WritableStream.prototype?.write?.call?.(this, ...args);
            }
        }
        var stdout = new EvalConsoleOutput()
        var stderr = new EvalConsoleOutput()
        var context = {
            console: new Console({ stdout, stderr, colorMode: false })
        }
        var vm = new vm2.VM({ timeout: 2500, sandbox: context })
        var r = vm.run(d.code)
        parentPort.postMessage({ id: d.id, out: inspect(r), console: str })
    } catch (er) {
        try {parentPort.postMessage({ id: d.id, out: "", error: { name: er.name, message: er.message, stack: er.stack, footer: er.footer }, console: "" })} catch (er) { console.log(er) }
    }
})
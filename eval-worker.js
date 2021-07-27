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
        class BadBuffer{
            constructor() {
                throw new Error(`Lol no`)
            }
            static alloc() {
                throw new Error(`Lol no`)
            }
            static of() {
                throw new Error(`Lol no`)
            }
            static from() {
                throw new Error(`Lol no`)
            }
        }
        class BadProxy {
            constructor(o, c) {
                throw new Error(`ha ha you tried`)
            }
        }
        var stdout = new EvalConsoleOutput()
        var stderr = new EvalConsoleOutput()
        var h = new Proxy({}, {
            get(t, k) {
                if (Math.random() > 0.5) {
                    return t[k]
                } else throw new Error('me when random chance')
            },
            set(t, k, v) {
                t[k] = v
            },
            ownKeys(t) {
                return Object.getOwnPropertyNames(t)
            }
        })
        var context = {
            console: new Console({ stdout, stderr, colorMode: false }),
            Buffer: h,
            Proxy: h,
            Reflect: h
        }
        var vm = new vm2.VM({ timeout: 2500, sandbox: context })
        var r = vm.run(d.code)
        parentPort.postMessage({ id: d.id, out: inspect(r), console: str })
    } catch (er) {
        try {parentPort.postMessage({ id: d.id, out: "", error: { name: er.name, message: er.message, stack: er.stack, footer: er.footer }, console: "" })} catch (er) { console.log(er) }
    }
})
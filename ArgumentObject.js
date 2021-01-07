module.exports = class ArgumentObject {
    name = ""
    optional = false
    type = "string"
    default = ""
    description = "h"
    constructor(name, type) {
        this.name = name;
        this.type = type;
    } 
    toString() {
        return `<${this.name}${this.optional ? '?' : ''} : ${this.type}>`
    }
}
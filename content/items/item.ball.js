const stuff = require("../../stuff")

module.exports = {
    name: "Ball",
    icon: "<:totaloblivionv:896324087088021554>",
    price: 999,
    description: "Balls",
    extraInfo: "Balls",
    onUse(user, msg) {
        var fight = stuff.fighting[user]
        if (fight) {
            var e = fight.aliveEnemies[0]
            if (e) {
                fight.ended = true
                fight.ran = true
                var obj = {
                    level: 1,
                    species: e.id,
                    name: e.name,
                    item: null,
                }
                stuff.addThing(user, obj)
            }
        }
        throw ''
    }
}
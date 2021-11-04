const stuff = require("../../stuff")

module.exports = {
    icon: "💊",
    name: "Drugs",
    description: "drugs",
    price: 0.28046,
    description: "It is said using it while fighting certain enemies can turn them into something else",
    veModeExclusive: true,
    extraInfo: "drugs",
    onUse(u, m) {
        if (!stuff.fighting[u]) throw 'No.';
        async function transform(e, into) {            
            var prime = stuff.enemies[into]
            await m.channel.send(`${e.name} Turned into ${prime.name}!`)
            e.type = prime;
            e.health = (e.health / e.maxHealth) * prime.maxHealth;
            e.maxHealth = prime.maxHealth; 
            e.attack = prime.maxAttack;
            e.defense = prime.maxDefense;
            e.name = prime.name;
            e.id = prime.id;
            e.moneyReward = prime.moneyReward * 2
            e.xpReward = prime.xpReward
            e.message = null;
        }
        for (var e of stuff.fighting[u].enemies) {
            if (e.type.drugTransform) {
                transform(e, e.type.drugTransform)
            }
        }
    }
}
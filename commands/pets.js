var stuff = require('../stuff')
stuff.petMul = function(pet) {
    return (((pet.baseMultiplierAdd || 5) + (pet.chonk * (pet.baseMultiplierAdd || 5) * 0.035)) || 0) * 1.05
}
module.exports = {
    name: "pets",
    useArgsObject: true,
    arguments: [
        {
            name: "pet",
            type: "int",
            optional: true,
            default: undefined
        },
        {
            name: "thing",
            type: "string",
            default: "info",
            optional: true
        },
        {
            name: "amount",
            type: "any",
            default: 1,
            optional: true
        }
    ],
    async execute(message, args) {
        var u = stuff.db.data[message.author.id]
        if (!u.pets?.length) throw `me when no pets`
        var p = stuff.pets
        function icon(el) {
            return p[el.id]?.icon || el.icon || "ú"
        }
        function item(it) {
            if (typeof it == "string") it = { id: it }
            return `${stuff.shopItems[it.id].icon} ${stuff.shopItems[it.id].name}`
        }
        function petPrev(pet) {
            return `${icon(pet)} ${pet.name}`
        }
        var petMul = stuff.petMul
        if (isNaN(args.pet)) {
            var embed = {
                title: `Ha ha yes pets are back`,
                description: `${u.pets.map((el, i) => `\`${i}\` ${icon(el)} \`${el.id}\` ${el.name} (${stuff.shopItems[el.food].icon} ${stuff.format(el.chonk)}/${stuff.format(el.maxChonk)})`).join("\n")}`
            }
            await message.channel.send({embed: embed})
        } else {
            var pet = u.pets[args.pet]
            if (!pet) throw `when invalid pet`
            if (!pet.chonk && pet.happiness) pet.chonk = pet.happiness
            pet.chonk = pet.chonk || 0
            if (!pet.maxChonk) pet.maxChonk = Math.floor(100 * (1 + (Math.random() * 0.25)))
            delete pet.happiness
            if (args.thing == "feed") {
                var amt = stuff.clamp(args.amount || 1, 1, stuff.getConfig("massFeedLimit"))
                var i = 0
                var total = 0
                while (i < amt && stuff.removeItem(message.author.id, pet.food)) {
                    var a = Math.random() * 3
                    pet.chonk += a
                    total += a
                    if (pet.chonk >= pet.maxChonk) {
                        if (Math.random() < 0.25) {
                            pet.maxChonk += a;
                        } else break;
                    }
                    i++
                }
                var embed = {
                    description: `Gave ${petPrev(pet)} ${i}x ${item(pet.food)} and got +${(total).toFixed(1)} more chonk`
                }
                await message.channel.send({embed: embed})
            } else {
                var embed = {
                    title: `${icon(pet)} ${pet.name}`,
                    description: `Food: ${item(pet.food)}\nChonk level: ${stuff.format(pet.chonk)}/${stuff.format(pet.maxChonk)} ${("🟦".repeat(stuff.clamp((pet.chonk / pet.maxChonk) * 20, 0, 128)))}\nMultiplier: ${stuff.format(petMul(pet))}`,
                }
                await message.channel.send({embed: embed})
            }
        }
    }
}
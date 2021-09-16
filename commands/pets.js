var stuff = require('../stuff')
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
        function petMul(pet) {
            return pet.chonk * (pet.baseMultiplierAdd || 5)
        }
        if (isNaN(args.pet)) {
            var embed = {
                title: `Ha ha yes pets are back`,
                description: `${u.pets.map((el, i) => `\`${i}\` ${icon(el)} \`${el.id}\` ${el.name}`).join("\n")}`
            }
            await message.channel.send({embed: embed})
        } else {
            var pet = u.pets[args.pet]
            if (!pet) throw `when invalid pet`
            if (!pet.chonk && pet.happiness) pet.chonk = pet.happiness
            if (!pet.fed) {
                pet.chonk = 0
                pet.fed = true
            }
            delete pet.happiness
            if (args.thing == "feed") {
                var amt = stuff.clamp(args.amount || 1, 1, stuff.getConfig("massFeedLimit"))
                var i = 0
                var total = 0
                while (i < amt && stuff.removeItem(message.author.id, pet.food)) {
                    var a = Math.random() * 0.007
                    pet.chonk += a
                    total += a
                    i++
                }
                u.multiplier += a * (pet.baseMultiplierAdd || 5)
                var embed = {
                    description: `Gave ${petPrev(pet)} ${i}x ${item(pet.food)} and got +${(total * 100).toFixed(1)}% more chonk`
                }
                await message.channel.send({embed: embed})
            } else {
                var embed = {
                    title: `${icon(pet)} ${pet.name}`,
                    description: `Food: ${item(pet.food)}\nChonk level: ${(pet.chonk * 100).toFixed(1)}% ${("🟦".repeat(stuff.clamp(pet.chonk * 20, 0, 128))).padEnd(20, "⬛")}\nMultiplier: ${stuff.format(petMul(pet))}`,
                }
                await message.channel.send({embed: embed})
            }
        }
    }
}
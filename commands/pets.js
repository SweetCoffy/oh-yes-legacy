const CommandError = require("../CommandError");
const stuff = require("../stuff");

module.exports = {
    name: "pets",
    description: "shows a list of your pets or info about a specific pet",
    usage: "pets [index:int]",
    execute(message, args) {
        var i = parseInt(args[0]);
        if (!args[0]) {
            var petNames = [];
            var pets = stuff.db.getData(`/${message.author.id}/pets`);
            var i = 0;
            pets.forEach(el => {
                petNames.push(`\`${i}\` ${el.icon} **${el.name}**`)
                i++;
            })
            var embed = {
                title: `${message.author.username}'s basement`,
                description: petNames.slice(0, 20).join("\n"),
                footer: {
                    text: `use ;pets <index> to see info about that specific pet, you have ${petNames.length} pets h`
                }
                
            };
            message.channel.send({embed: embed});
        } else {
            var pet = stuff.db.getData(`/${message.author.id}/pets`)[i];
            if (!pet) throw new CommandError("Pet not found", `You don't have a pet at index \`${i}\`!!1!!!1`)
            if (!stuff.db.exists(`/${message.author.id}/pets[${i}]/happiness`)) {
                stuff.db.push(`/${message.author.id}/pets[${i}]/happiness`, 0.5);
            }
            if (args[1] == "feed") {
                var repeat = stuff.clamp(parseInt(args[2]) || 1, 1, 500);
                
                var mult = pet.baseMultiplierAdd || 250;
                var happiness = stuff.db.getData(`/${message.author.id}/pets[${i}]/happiness`);
                stuff.repeat(() => {


                    if (stuff.removeItem(message.author.id, pet.food)) {
                        var _happiness = stuff.db.getData(`/${message.author.id}/pets[${i}]/happiness`);
                        
    
                        
                        
                        stuff.db.push(`/${message.author.id}/pets[${i}]/happiness`, _happiness + (0.7 * Math.random()));
    
                        
    
                        
    
                        if (repeat < 2) {
                            message.channel.send({embed: {
                                color: stuff.shopItems[pet.food].rarity,
                                description: `You gave **${pet.name}**: ${stuff.shopItems[pet.food].icon} ${stuff.shopItems[pet.food].name} h`
                            }})
                        }
                    } else {
                        stuff.addMultiplier(message.author.id, -mult * happiness)
                        happiness = stuff.db.getData(`/${message.author.id}/pets[${i}]/happiness`);
                        stuff.addMultiplier(message.author.id, mult * happiness)
                        throw new CommandError("Item not found", `You don't have ${stuff.shopItems[pet.food].icon} ${stuff.shopItems[pet.food].name} in your inventory!1!!!1!`)
                    }
                }, repeat).then(([repeat, err]) => {
                    stuff.addMultiplier(message.author.id, -mult * happiness)
                    happiness = stuff.db.getData(`/${message.author.id}/pets[${i}]/happiness`);
                    stuff.addMultiplier(message.author.id, mult * happiness)
    
                    if (repeat > 1) {
                        message.channel.send({embed: {
                            color: stuff.shopItems[pet.food].rarity,
                            description: `You gave **${pet.name}**: ${repeat}x ${stuff.shopItems[pet.food].icon} ${stuff.shopItems[pet.food].name} h`
                        }})
                    }
                    if (err) stuff.sendError(message.channel, err)
                })
                
            } else if (args[1] == "attack") {
                if (!stuff.currentBoss) {
                    throw new CommandError("Boss not found", "There is no boss to fight!")
                }
                if (stuff.userHealth[message.author.id] <= 0) {
                    throw new CommandError("ded", "you can't attack bosses while dead lolololol")
                }

                var happiness = stuff.db.getData(`/${message.author.id}/pets[${i}]/happiness`);
                var attackDamage = stuff.db.getData(`/${message.author.id}/pets[${i}]`).damage || 5;
                var totalAttackDamage = attackDamage * happiness;
                var damageDealt = stuff.clamp(totalAttackDamage * 2 * Math.random(), attackDamage, totalAttackDamage * 1.5);
                var dmgReduction = (stuff.currentBoss.damageReduction || 4);
                stuff.currentBoss.health -= damageDealt / dmgReduction;
                if (!stuff.currentBoss.fighting.includes(message.author.id)) {
                    stuff.currentBoss.fighting.push(message.author.id);
                    
                }
                var defense = stuff.getDefense(message.author.id);
                var dmg = stuff.clamp(((stuff.currentBoss.damage || 200) * stuff.clamp(Math.random() * 1.2, 0.5, 1.2)) - defense, 1, Infinity);
                if (Math.random() < 0.6) {
                    
                    
                    stuff.userHealth[message.author.id] -= dmg;
                    if (stuff.userHealth[message.author.id] <= 0) {
                        message.channel.send({embed: {description: `${message.author} died, respawning in 10 seconds`}})
                        setTimeout(() => {
                            stuff.userHealth[message.author.id] = stuff.getMaxHealth(message.author.id);
                            message.channel.send({embed: {description: `${message.author} just respawned`}})
                        }, 10000)
                        return;
                    }
                } else {
                    dmg = 0;
                }
                var helth = stuff.userHealth[message.author.id];
                var maxHelth = stuff.getMaxHealth(message.author.id);
                var embed = {
                    title: `${(stuff.currentBoss.fighting.length == 1) ? "1 Player" : `${stuff.currentBoss.fighting.length} Players`} vs ${stuff.currentBoss.name}`,
                    fields: [
                        {
                            name: stuff.currentBoss.name,
                            value: `${"▮".repeat(stuff.clamp(stuff.currentBoss.health / stuff.currentBoss.maxHealth * 20, 0, Infinity))}${"▯".repeat(stuff.clamp((1 - (stuff.currentBoss.health / stuff.currentBoss.maxHealth)) * 20, 0, Infinity))} ${stuff.format(stuff.currentBoss.health)}/${stuff.format(stuff.currentBoss.maxHealth)} **-${stuff.format(damageDealt)}**`
                        },
                        {
                            name: message.author.username,
                            value: `${"▮".repeat(stuff.clamp(helth / maxHelth * 20, 0, Infinity))}${"▯".repeat(stuff.clamp((1 - (helth / maxHelth)) * 20, 0, Infinity))} ${stuff.format(stuff.userHealth[message.author.id])}/${stuff.format(stuff.getMaxHealth(message.author.id))} **-${stuff.format(dmg)}**`
                        }
                    ]
                }
                message.channel.send({embed: embed})
                if (stuff.currentBoss.health <= 0) {
                    message.channel.send(`${stuff.currentBoss.name} has been defeated!`)
                    stuff.currentBoss.fighting.forEach(u => {
                        stuff.addPoints(u, stuff.currentBoss.drops / stuff.currentBoss.fighting.length);
                        var itemDrops = stuff.currentBoss.itemDrops;
                        if (itemDrops) {
                            itemDrops.forEach(it => {
                                stuff.addItem(u, it)
                            })
                        }
                    })
                    stuff.currentBoss = undefined;
                    return;
                }

                
                
                
            } else if (args[1] == "release") {
                message.channel.send(`Your ${stuff.db.getData(`/${message.author.id}/pets[${i}]/`).name} is now gone forever h`);
                stuff.db.delete(`/${message.author.id}/pets[${i}]/`);
            } else {
                var happiness = stuff.db.getData(`/${message.author.id}/pets[${i}]/happiness`);
                var mult = pet.baseMultiplierAdd || 250;
                var totalMult = mult * happiness;
                var attackDamage = stuff.db.getData(`/${message.author.id}/pets[${i}]`).damage || 5;
                var totalAttackDamage = attackDamage * happiness;
                var chonkBar = `${"▮".repeat(stuff.clamp(happiness * 10, 0, 500))}${"▯".repeat(stuff.clamp((1 - happiness) * 20, 0, Infinity))}`;
                var multiplierBar = `${"▮".repeat(stuff.clamp((totalMult / mult) * 10, 0, 500))}${"▯".repeat(stuff.clamp((1 - (totalMult / mult)) * 20, 0, Infinity))}`;
                var damageBar = `${"▮".repeat(stuff.clamp((totalAttackDamage / attackDamage) * 10, 0, 500))}${"▯".repeat(stuff.clamp((1 - (totalAttackDamage / attackDamage)) * 20, 0, Infinity))}`;
                var embed = {
                    title: `${pet.icon} ${pet.name}`,
                    fields: [
                        {
                            name: "favorite food",
                            value: `${stuff.shopItems[pet.food].icon} ${stuff.shopItems[pet.food].name}`
                        },
                        {
                            name: "chonk level",
                            value: `${(chonkBar.length > 200) ? "<insert long bar here>" : chonkBar} ${(happiness * 100).toFixed(1)}%`
                        },
                        {
                            name: "multiplier",
                            value: `${(multiplierBar.length > 200) ? "<insert long bar here>" : multiplierBar} ${stuff.format(totalMult)}`
                        },
                        {
                            name: "attack damage",
                            value: `${(damageBar.length > 200) ? "<insert long bar here>" : damageBar} ${stuff.format(totalAttackDamage)}`
                        }
                    ]
                }
                message.channel.send({embed: embed});
            }
        }
    }
}
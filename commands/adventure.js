var Discord = require('discord.js')
var stuff = require('../stuff')
module.exports = {
    name: "adventure",
    description: 'ha ha yes bootleg bread adventures',
    requiredPermission: 'yes',
    /**
     * 
     * @param {Discord.Message} message 
     */
    async execute(message) {
        var points = 0;
        var eggs = 0;
        var tasksDone = 0;
        var tasks = {}
        var curRoom = undefined
        var possibleRooms = [
            {
                name: 'Egg Shrine',
                id: 'egg-shrine',
                eggCount: 7,
                tasks: [
                    {
                        name: "Hail Eggs",
                        message: `You hailed eggs and saved 2 of them`,
                        id: `hail-eggs`,
                        points: 15,
                        saveEggs: true,
                        savedEggs: 2,
                        done: false,
                        check: () => true
                    },
                    {
                        name: "Find the computer room",
                        message: `You found some egg models in the computer and 3d printed them`,
                        id: `computer-room`,
                        savedEggs: 5,
                        points: 15,
                        saveEggs: true,
                        check: () => eggs >= 4
                    },
                ]
            },
            {
                name: 'Egg Lab',
                id: 'egg-lab',
                eggCount: 3,
                tasks: [
                    {
                        name: `Look around`,
                        id: `look-around`,
                        points: 0,
                        done: false,
                        saveEggs: true,
                        savedEggs: 1,
                        message: `You looked around the lab and found an interesting looking box, a key and an egg`,
                        check: () => true,
                    },
                    {
                        name: `Open box`,
                        id: `open-box`,
                        points: 0,
                        done: false,
                        message: `You opened the interesting box and found some eggs`,
                        check: () => tasks[`egg-lab-look-around`],
                    },
                    {
                        name: "Grab Key",
                        id: `grab-key`,
                        points: 5,
                        done: false,
                        message: `You got the key`,
                        check: () => tasks[`egg-lab-open-box`],
                    },
                    {
                        name: "Save the Eggs",
                        id: `save-eggs`,
                        points: 30,
                        done: false,
                        message: `You saved the eggs`,
                        check: () => tasks[`egg-lab-open-box`],
                        saveEggs: true,
                        savedEggs: 2,
                    },
                ]
            },
            {
                name: "Egg Reactor",
                id: `egg-reactor`,
                eggCount: 7,
                tasks: [
                    {
                        name: "Open door",
                        id: 'open-door',
                        points: 0,
                        message: `The door to the reactor room opened with the key from earlier and found an egg in the floor`,
                        done: false,
                        saveEggs: true,
                        savedEggs: 1,
                        check: () => tasks['egg-lab-grab-key']
                    },
                    {
                        name: `Turn off reactor`,
                        id: 'kill-reactor',
                        points: 20,
                        message: `You turned off the reactor`,
                        check: () => tasks['egg-shrine-computer-room'] && tasks['egg-reactor-open-door'] && eggs >= 6,
                        done: false,
                    },
                    {
                        name: `Take out eggs`,
                        id: `remove-eggs`,
                        points: 50,
                        message: `You took out the eggs that power the reactor and power died`,
                        saveEggs: true,
                        savedEggs: 6,
                        check: () => tasks['egg-reactor-kill-reactor']
                    }
                ]
            }
        ]
        var rooms = possibleRooms.map(el => Object.create(el))
        for (const r of rooms) {
            for (const t of r.tasks) {
                tasks[`${r.id}-${t.id}`] = false;
            }
        }
        var delay = function (time) {
            return new Promise(resolve => {
                setTimeout(resolve, time)
            })
        }
        var selectTask = async function (msg) {
            msg = await msg.edit(`**${curRoom.name}**:\n\nTasks:\n${curRoom.tasks.map(el => `${!el.done ? `${el.check() ? '' : '🚫'}❗${el.saveEggs ? `🥚x ${el.savedEggs}` : ''} **${el.name}**` : `❕ ${el.name}`}`).join('\n') || '<nothing>'}\n\nThis room has ${curRoom.eggCount} eggs to save\n\nSay 'leave' to leave this room`)
            var m = (await message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 1000 * 80})).first()
            await m.delete()
            if (m.content.toLowerCase() == 'leave') {
                return await selectRoom(msg)
            }
            var task = undefined
            for (const t of curRoom.tasks) {
                if (t.name.toLowerCase() == m.content.toLowerCase()) task = t;
            }
            if (task) {
                if (task.done) {
                    msg = await msg.edit(`You can't do a task that you've already done`)
                    await selectTask(msg)
                } else {
                    if (!task.check()) {
                        msg = await msg.edit(`You can't do this task yet`)
                        await delay(1000)
                        return await selectTask(msg);
                    }
                    if (task.saveEggs) {
                        curRoom.eggCount -= task.savedEggs 
                        eggs += task.savedEggs
                    }
                    task.done = true;
                    tasksDone++
                    points += task.points;
                    tasks[`${curRoom.id}-${task.id}`] = true;
                    msg = await msg.edit(`${task.message}`)
                    await delay(2000)
                    await selectTask(msg)
                }
            } else {
                await selectTask(msg)
            }
        }
        var selectRoom = async function(msg) {
            curRoom = undefined;
            var txt = `Choose a room:\n\n${rooms.map(el => {
                var pending = el.tasks.filter(el => !el.done).length
                return `**${el.name}**:\n🥚x ${el.eggCount}\n❗x ${pending}`
            }).join('\n\n')}\n\nSay 'quit' to quit this egg adventure`;
            if (!msg) msg = await message.channel.send(txt)
            else msg = await msg.edit(txt)
            var m = (await message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 1000 * 80})).first()
            if (!m || m.content == 'quit') {
                return await msg.edit(`This egg adventure has ended\n\nPoints: ${points}\nTasks: ${tasksDone}\nEggs: ${eggs}\n\nTotal: ${points + (tasksDone * 50) + (eggs * 100)}`)
            }
            await m.delete()
            var r = undefined
            for (const e of rooms) {
                if (e.name.toLowerCase() == m.content.toLowerCase()) r = e;
            }
            if (r) {
                curRoom = r;
                await selectTask(msg)
            } else {
                
                await selectRoom(msg)
            }
        }
        await selectRoom()
    }
}
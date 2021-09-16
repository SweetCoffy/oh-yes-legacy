var stuff = require('../stuff.js')
if (!stuff.timers) stuff.timers = {}
module.exports = {
	name: "timer",
	description: "A speedrun timer",
	execute(msg) {
		var id = msg.author.id
		if (stuff.timers[id]) {
			var ms = Date.now() - stuff.timers[id]
			var s = Math.floor(ms / 1000)
			var m = Math.floor(s / 60)
			msg.channel.send(`Time: **${m}:${s % 60}**.${Math.floor((ms % 1000) / 10)}`)
			stuff.timers[id] = null
		} else {
			msg.channel.send(`Timer started`)
			stuff.timers[id] = Date.now()
		}
	}
}

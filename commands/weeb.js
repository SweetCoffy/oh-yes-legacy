module.exports = {
    name: "weeb",
    description: "shows someone's weeb level",
    usage: "weeb <person>",
    execute (message) {
        var user = message.mentions.members.first();
        if (!user) throw "e";
        var levelMultipliers = {
            "676696728065277992": 4,
            "630489464724258828": 0,
            "528309195116642314": 0,
            "602651056320675840": 0,
        }



        var level = Math.random();
        var label = "weeb";
        if (user.id == "676696728065277992") {
            level = 420694206942069
        }
        if (user.id == "630489464724258828") {
            level *= 0   
        }
        if (user.id == "528309195116642314") {
            level *= 0   
        }
        if (user.id == "602651056320675840") {
            level *= 0   
		}
		if (user.id == "612630320386146313") {
			level *= 0
		}
        if (level > 2) {
            label = "weeaboo";
        }
        if (level > 15) {
            label = "Weeaboo Premium Deluxe VIP MVP+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++";
        }
        if (level < 1) {
            label = "weeb";
        }
        if (level < 0.5) {
            label = "half weeb"
        }
        if (level < 0.25) {
            label = "maybe a weeb"
        }
        if (level < 0.05) {
            label = "weebn't"
        }
        var embed = {
            title: `${user.displayName || user.user.username}'s weeb level:`,
            description: `${(level * 100).toFixed(1)}% (${label})`
        }
        message.channel.send({embed: embed});
    }
}
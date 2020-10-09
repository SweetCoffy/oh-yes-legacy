const stuff = require('../stuff');

module.exports = {
    name: "update",
    minVer: 0.001,
    async execute(message, args, phoneData, slot) {
        var msg = await message.channel.send("checking for updates");
        if (phoneData.ver >= stuff.recentPhoneVer.number) {
            msg.edit("no updates found");
        } else {
            var progress = 0;
            var timer = setInterval(() => {
                progress += 100;
                msg.edit(`update ${stuff.recentPhoneVer.number} progress: ${((progress / stuff.recentPhoneVer.updateDuration || 0) * 100).toFixed(1)}%\n${((stuff.recentPhoneVer.updateDuration - progress) / 1000).toFixed(1)} seconds left`)
                if (progress >= stuff.recentPhoneVer.updateDuration) {
                    msg.edit(`update complete`);
                    stuff.setPhoneVer(message.author.id, slot, stuff.recentPhoneVer.number, stuff.recentPhoneVer.name)
                    clearInterval(timer);
                }
            }, 100)

        }
    }
}
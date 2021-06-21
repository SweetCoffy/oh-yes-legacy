module.exports = {
    name: "snipe",
    async execute(message, a, _a, flags) {
        var del = message.client.snipe[0];
        var max = 5;
        var left = max;
        while (del != undefined && left > 0) {
            if (!del) throw `There is nothing to snipe!!1!11`
            var embed = {
                author: {
                    name: del.author.username,
                    icon_url: del.author.displayAvatarURL()
                },
                description: del.content,
                footer: { text: `Messages left: ${message.client.snipe.length - 1}` }
            }
            if (del.embeds[0]) {
                var e = del.embeds[0];
                embed.fields = []
                if (e.title) embed.fields.push({ name: "Title", value: e.title })
                if (e.description) embed.fields.push({ name: "Description", value: e.description })
                if (e.footer?.text) embed.fields.push({ name: "Footer", value: e.footer?.text })
                if (e.fields) {
                    var i = 1;
                    for (var field of e.fields) {
                        embed.fields.push({ name: `${field.name} (Field)`, value: `${field.value}` })
                        i++;
                    }
                }
                if (e.color) embed.color = e.color;
            }
            if (embed.description.includes("http://") || embed.description.includes("https://")) embed.description = "no lenks allowed"
            await message.channel.send({embed: embed})
            message.client.snipe.shift();
            if (!flags.all) break;
            del = message.client.snipe[0]
            left--;
        }
    }
}
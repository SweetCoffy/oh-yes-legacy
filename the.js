const Discord = require('discord.js');
const client = new Discord.Client();
const randomstring = require("randomstring");
var isMining = false;
var channel;
const prefix = '!';

client.on('message', msg => {

    let args = msg.content.slice(prefix.length).trim().split(' ');

    if (msg.content.startsWith(`${prefix}setup`)) {

        if (!msg.guild.member(client.user).hasPermission(["MANAGE_CHANNELS", "ADMINISTRATOR"])) return;
        msg.guild.channels.create(mining, 'text').catch(e => { });

    }
    if (msg.content.startsWith(`${prefix}mine`)) {
        isMining = !isMining
        if (isMining && !channel) {
          isMining = false;
          msg.channel.send(`You must set a channel first by using ${prefix}channel on the channel`)
        }
        msg.channel.send(`Mining is ${isMining ? "On" : "Off"}`)
    }
    if (msg.content.startsWith(`${prefix}channel`)) {
        channel = msg.channel;
        msg.channel.send(`Mining channel is now ${channel}`)
    }



});

client.on('ready', async () => {
    console.log('lets mine!')
    setImmediate(async() => {
      if (isMining) {
        channel.send("htps://discord.gift/" + randomstring.generate(16));
      }
    })
    setInterval(function () {
        let status = `${client.users.cache.size} Miners`;
        client.user.setActivity(status, {
            type: "STREAMING",
            url: "https//ww.twith.tv/real_twitcher"
        })
    }, 4000)
})
client.login('TOKEN')

## how 2 get the message ur bot just sent

```js
<Channel>.send("egg").then(m => {
    // do stuff with the message
    m.react("\:egg:");
})
```

## how 2 get the server where the message has been sent

```js

client.on("message", msg => {
    var guild = msg.guild;
    // now you can do stuff with it
    // example:
    if (msg.content === "server-info") {
        msg.channel.send(`
            Server info:\n
            name: ${guild.name}\n
            members: ${guild.memberCount}
            `);
    }
})

```

## how 2 react to pings 

```js  
    client.on("message", msg => {
        // get the first user
        var user = msg.mentions.users.first();

        // check if the user is the bot
        if (user.id === "bot id goes here") {
            // do stuff
            msg.reply("u pinged me");
        }
    });   
```

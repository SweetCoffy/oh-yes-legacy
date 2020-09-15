# **commands**
self explanatory

## **how 2 make command**
to make a command use this little code snippet:
```js
module.exports = {
    name: "name", // must be file name withtout extension
    description: "", // optional

    usage: "", // also optional

    // required
    execute(message, args) {
        // command code goes here.
        // example:
        message.channel.send(
            `<@${message.author.id}> get pinged lol, the first argument entered is: ${args[0]}`
            
        );
    }
}
```

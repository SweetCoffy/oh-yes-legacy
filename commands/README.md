# **commands**
self explanatory

## **how 2 make command**
to make a command, create a new file called `[command name].js` and paste on it the following code snippet:
```js
module.exports = {
    name: "name", // must be file name without extension, required

    // required
    execute(message, args) {
        // command code goes here
        // example:
        message.channel.send(
            `<@${message.author.id}> get pinged lol, the first argument entered is: ${args[0]}`
            
        );
    }
}
```

**some other properties that are optional:**
* `description` text that will be shown in the command's help embed, if not present it will show `<eggs>`
* `usage` usage that will be shown in the command's help embed, intended format: `[command name] [arg1:type] [arg2:type] [arg3:type] [etc...]`
* `requiredPermission` permission required to use this command, defaults to `""` (anyone can use it)

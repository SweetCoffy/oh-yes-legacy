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

## **command file properties**
(* = required)
| name | type | description |
|------|------|------------ |
| name* | string | property used for some stuff, must be the same as the file name without the extension to work properly
|description | string | text shown in the command's help embed description
| usage | string | text shown in the command's help embed
| requiredPermission | string | permission required to perform the command
| removed | bool | wether or not this command has been removed, when true any attempts to perform the command will result in an error




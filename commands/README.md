# **commands**
self explanatory

###### oh boi, there's a lot of commands

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
| execute | function | function that accepts up to 3 arguments (message, args, extraArgs), will be called when the command is performed

## **how 2 make stuff**
i've made some example code ~~that nobody will ever read~~ about some stuff h

* [how 2 get the message your bot just sent](https://github.com/Sebo2205/oh-yes/blob/master/commands/idk.md#how-2-get-the-message-ur-bot-just-sent)

* [how 2 get message guild](https://github.com/Sebo2205/oh-yes/blob/master/commands/idk.md#how-2-get-the-server-where-the-message-has-been-sent)

* [how 2 react to pings](https://github.com/Sebo2205/oh-yes/blob/master/commands/idk.md#how-2-react-to-pings)



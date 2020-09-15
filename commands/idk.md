## how 2 get the message ur bot just sent

```js
<Channel>.send("egg").then(m => {
    // do stuff with the message
    m.react("\:egg:")
})
```
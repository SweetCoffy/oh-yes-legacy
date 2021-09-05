module.exports = (str, message) => {
    if (!str) return message.author;
    if (str.toString() == "me") return message.author;
    var regex = /<@!{0,}(\d+)>/
    var match = str.match(regex);
    if (!match) return message.client.users.cache.get(str);
    return message.client.users.cache.get(match[1]);
}
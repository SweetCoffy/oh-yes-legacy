module.exports = (str, message) => {
    if (str == 'this') return message.channel;
    var regex = /<#(\d+)>/;
    var match = str.match(regex) || ['', ''];
    return message.guild.channels.cache.get(match[1]);
}
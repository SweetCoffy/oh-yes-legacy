const stuff = require("../../stuff");

module.exports = (message, args, phoneData, slot) => phoneData.vars[args[1]] = stuff.readPhoneFile(message.author.id, slot, args[0])
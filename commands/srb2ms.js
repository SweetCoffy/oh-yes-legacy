const { execute } = require("./pvp-do");
const { default: Axios } = require('axios')
module.exports = {
    name: "srb2ms",
    arguments: [
        {
            name: "room",
            type: "int",
            default: -1,
            optional: true,
        }
    ],
    useArgsObject: true,
    async execute(msg, args) {
        console.log(args)
        var baseURL = "https://mb.srb2.org/MS/0"
        if (!args.room || args.room == -1) {
            var str = await (await Axios.get(`${baseURL}/rooms/`)).data.replace(/\r/g, "")
            var g = str.split("\n\n\n")
            msg.channel.send(`${g.map(el => {
                var h = el.split("\n").filter(el => el)
                var id = h[0]
                var name = h[1]
                var desc = h.slice(2).join("\n")
                return `**${name}** (\`${id}\`)\n${desc}`
            }).join("\n\n")}`)
        } else {
            var str = await (await Axios.get(`${baseURL}/rooms/${args.room}/servers`)).data.replace(/\r/g, "")
            var g = str.split("\n").slice(1).filter(el => el)
            msg.channel.send(`${g.map(el => {
                /**
                 * @type {String[]}
                 */
                var h = el.split(" ")
                console.log(h)
                var ip = h[0]
                var port = h[1]
                var name = h[2].replace(/%([\da-fA-F]{2})/g, function(substr, str) {
                    console.log(`${substr} ${str}`)
                    return String.fromCharCode(parseInt(str, 16))
                })
                var version = h[3]
                return `${name}\nv${version}`
            }).join("\n")}`)
        }
    }
}
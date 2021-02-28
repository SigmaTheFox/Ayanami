module.exports = {
    name: "avatar",
    category: "utility",
    description: "Get someone else's or your own profile picture",
    usage: "(@User)",
    execute(ayanami, message, args) {
        if (message.mentions.users.first()) {
            return message.reply(message.mentions.users.first().displayAvatarURL({format: "png", dynamic: true, size: 4096}))
        }
        else message.reply(message.author.displayAvatarURL({format: "png", dynamic: true, size: 4096}))
    }
}

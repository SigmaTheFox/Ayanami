module.exports = {
    name: "avatar",
    category: "utility",
    description: "Get someone else's or your own profile picture",
    execute(ayanami, message, args) {
        if (message.mentions.users.first()) {
            return message.reply(message.mentions.users.first().displayAvatarURL())
        }
        else message.reply(message.author.displayAvatarURL())
    }
}

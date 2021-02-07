module.exports = {
    name: "avatar",
    execute(ayanami, message, args) {
        if (message.mentions.users.first()) {
            return message.reply(message.mentions.users.first().displayAvatarURL({ format: 'png', size: 2048 }))
        }
        else message.reply(message.author.displayAvatarURL({ format: 'png', size: 2048 }))
    }
}

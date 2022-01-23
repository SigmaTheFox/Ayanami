module.exports = {
    name: "avatar",
    category: "utility",
    description: "Get someone else's or your own user profile picture",
    usage: "(@User)",
    async execute(ayanami, message, args) {
        if (args.length) {
            let target = message.mentions.users.first() || await ayanami.users.cache.get(args[0]);
            return message.reply(target.displayAvatarURL({format: "png", dynamic: true, size: 4096}))
        }
        else message.reply(message.author.displayAvatarURL({format: "png", dynamic: true, size: 4096}))
    }
}

module.exports = {
    name: "avatar",
    category: "utility",
    description: "Get someone else's or your own profile picture",
    usage: "(@User)",
    async execute(ayanami, message, args) {
        if (args.length) {
            let target = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
            return message.reply(target.users.first().displayAvatarURL({format: "png", dynamic: true, size: 4096}))
        }
        else message.reply(message.author.displayAvatarURL({format: "png", dynamic: true, size: 4096}))
    }
}

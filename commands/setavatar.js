module.exports = {
    name: 'setavatar',
    category: "admin",
    description: "**BOT OWNER ONLY** Change Ayanami's profile picture.",
    args: true,
    usage: '<image link>',
    execute(ayanami, message, args) {
        const config = require("../settings/config.json");
        const avatarURL = args.join(" ");

        if (message.author.id !== config.ownerID)
            return message.reply("You're not my owner!");

        ayanami.user.setAvatar(avatarURL)
            .then(user => message.reply("Successfully changed avatar."))
            .catch((err) => {
                 ayanami.logger.error(err);
                message.reply("You're trying to change the avatar too quickly.")
            });
    }
}
module.exports = {
    name: 'setavatar',
    args: true,
    usage: '<image link>',
    execute(ayanami, message, args) {
        const config = require("../settings/config.json");
        const avatarURL = args.join(" ");
        const logs = require('../modules/logger');

        if (message.author.id !== config.ownerID)
            return message.reply("You're not my owner!");

        ayanami.user.setAvatar(avatarURL)
            .then(user => message.reply("Successfully changed avatar."))
            .catch((err) => {
                logs.error(err);
                message.reply("You're trying to change the avatar too quickly.")
            });
    }
}
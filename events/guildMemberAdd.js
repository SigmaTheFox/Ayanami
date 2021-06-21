module.exports = (ayanami, member) => {
    const { WelcomeMessage } = require("../settings/text.json");

    const welcomeChannel = member.guild.channels.cache.find(c => c.name === "new-users");

    if (welcomeChannel) {
        let msg = WelcomeMessage.join("\n").replace("{member}", member.id);
        welcomeChannel.send(msg);
    }
}
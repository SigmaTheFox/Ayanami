module.exports = (ayanami, member) => {
    const { WelcomeMessage } = require("../settings/text.json");

    const read_rules = member.guild.roles.cache.find(r => r.name === "Read rules");
    const welcomeChannel = member.guild.channels.cache.find(c => c.name === "new-users");

    if (read_rules) {
        member.roles.add(read_rules);
        return member.user.send(`Welcome to ${member.guild.name}, ${member.user.username}!\nMake sure to read the rules as there you'll find instructions on how to access other channels.`)
    }

    if (welcomeChannel) {
        let msg = WelcomeMessage.join("\n").replace("{member}", member.id);
        welcomeChannel.send(msg);
    }
}
const {MessageEmbed, GuildMember, Client} = require("discord.js");
const { WelcomeMessage } = require("../settings/text.json");

/**
 * 
 * @param {Client} ayanami 
 * @param {GuildMember} member 
 */
module.exports = (ayanami, member) => {

    const welcomeChannel = member.guild.channels.cache.find(c => c.name === "new-users");

    if (welcomeChannel) {
        let embed = new MessageEmbed()
        .setAuthor({name: member.user.username, iconURL: member.user.displayAvatarURL()})
        .setTitle(WelcomeMessage.title.replace("{{username}}", member.user.username))
        .setDescription(WelcomeMessage.description.join("\n"))
        .setFields([
            {name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp/1000, 10)}:f>`}
        ])
        welcomeChannel.send({content: member.toString(), embeds: [embed]});
    }
}
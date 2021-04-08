const { Client, GuildMember } = require("discord.js")
/**
 * 
 * @param {Client} ayanami 
 * @param {GuildMember} member 
 * @returns 
 */
module.exports = (ayanami, member) => {
    const read_rules = member.guild.roles.cache.find(r => r.name === "Read rules");
    const welcomeChannel = ayanami.channels.cache.get("724873889699856394");
    if (read_rules) {
        member.roles.add(read_rules);
        return member.user.send(`Welcome to ${member.guild.name}, ${member.user.username}!\nMake sure to read the rules as there you'll find instructions on how to access other channels.`)
    }

    welcomeChannel.send(`Welcome to Sigma's Den <@${member.id}>!\n`
        + `Please make sure to read and follow the <#724874019366502440>, \n`
        + `and if you want, you can get some <#724874048110067742>!\n`
        + `If you have any questions, feel free to mention or DM a Moderator.`)
}
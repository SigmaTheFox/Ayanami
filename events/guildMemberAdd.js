module.exports = (ayanami, member) => {
    const read_rules = member.guild.roles.cache.find(r => r.name === "Read rules");
    const welcomeChannel = member.guild.channels.cache.find(c => c.name === "new-users");

    if (read_rules) {
        member.roles.add(read_rules);
        return member.user.send(`Welcome to ${member.guild.name}, ${member.user.username}!\nMake sure to read the rules as there you'll find instructions on how to access other channels.`)
    }

    if (welcomeChannel) {
        welcomeChannel.send(`Welcome to Sigma's Den <@${member.id}>!\n`
            + `Please make sure to read and follow the <#724874019366502440>, \n`
            + `and if you want, you can get some <#724874048110067742>!\n`
            + `If you have any questions, feel free to mention or DM a Moderator.`)
    }
}
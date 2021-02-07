module.exports = (ayanami, member) => {
    const read_rules = member.guild.roles.cache.find(r => r.name === "Read rules")
    if (read_rules) {
        member.roles.add(read_rules);
        return member.user.send(`Welcome to ${member.guild.name}, ${member.user.username}!\nMake sure to read the rules as there you'll find instructions on how to access other channels.`)
    }
}
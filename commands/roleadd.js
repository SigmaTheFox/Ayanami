const { RolesDB } = require("../modules/dbObjects");

module.exports = {
    name: 'roleadd',
    category: "admin",
    description: "Add a reaction role to the database.",
    aliases: ['rolesadd', 'radd', 'ra'],
    args: true,
    usage: "<emote> | <Role Name (Case Sensitive)>",
    async execute(ayanami, message, args) {
        var emoteName;
        var regex = /<:.+:\d+>/

        if (message.channel.type == "dm") return message.reply("You can only use this command in the server.");
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You don't have permission to use this command.");

        const splitArgs = args.join(" ").split(" | ")
        var emote = splitArgs[0],
            roleName = splitArgs[1]

        if (!message.guild.roles.cache.find(r => r.name === roleName)) return message.reply("This role doesn't exist.")
        
        if (regex.test(emote)) emoteName = emote.slice(emote.indexOf(":") + 1, emote.lastIndexOf(":"));
        else emoteName = emote;

        try {
            const role = await RolesDB.findOne({
                where: { emote: emoteName, role: roleName }
            })

            if (role) return message.reply("This role already is in the database");

            await RolesDB.create({ emote: emoteName, role: roleName });
            return message.reply("Role added to the database.");
        } catch (err) {
            return message.reply("The role hasn't been added to the database.")
        }
    }
}

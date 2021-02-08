const { RolesDB } = require("../modules/dbObjects");

module.exports = {
    name: 'roleremove',
    category: "admin",
    description: "Remove a reaction role from the database.",
    aliases: ['roledelete', 'roledel', 'roledestroy', 'rd'],
    args: true,
    usage: "emote",
    async execute(ayanami, message, args) {
        var emoteName;
        var regex = /<:.+:\d+>/

        if (message.channel.type == "dm") return message.reply("You can only use this command in the server.");
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You don't have permission to use this command.");

        if (regex.test(args[0])) emoteName = args[0].slice(args[0].indexOf(":") + 1, args[0].lastIndexOf(":"));
        else emoteName = args[0];

        try {
            const role = await RolesDB.findOne({
                where: { emote: emoteName }
            })

            if (!role) return message.reply("Role doesn't exist in database.")

            await RolesDB.destroy({
                where: { emote: emoteName }
            })

            return message.reply("Role was deleted from database.")
        } catch (err) {
            return message.reply("Role wasn't deleted from database.")
        }
    }
}
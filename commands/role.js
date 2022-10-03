const { SlashCommandBuilder, Client, CommandInteraction, PermissionFlagsBits } = require("discord.js");
const { RolesDB } = require("../modules/dbObjects.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("Add or remove a reaction role on the server")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand(cmd =>
            cmd.setName("add")
                .setDescription("Add a reaction role to the server")
                .addStringOption(opt =>
                    opt.setName("emote")
                        .setDescription("The emote to tie to the role")
                        .setRequired(true))
                .addRoleOption(opt =>
                    opt.setName("role")
                        .setDescription("The role to add")
                        .setRequired(true)))
        .addSubcommand(cmd =>
            cmd.setName("remove")
                .setDescription("Remove a reaction role from the server")
                .addStringOption(opt =>
                    opt.setName("emote")
                        .setDescription("The emote tied to the role to remove")
                        .setRequired(true))),
    /**
     * @param {Client} ayanami
     * @param {CommandInteraction} interaction
     */
    async execute(ayanami, interaction) {
        if (interaction.options.getSubcommand("add")) {
            let emote = interaction.options.getString("emote"),
                roleName = interaction.options.getRole("role").name,
                regex = /<:.+:\d+>/,
                emoteName = regex.test(emote) ? emote.slice(emote.indexOf(":") + 1, emote.lastIndexOf(":")) : emote;

            try {
                let role = await RolesDB.findOne({ where: { emote: emoteName, role: roleName } })

                if (role) return interaction.reply({ content: "This role already is in the database", ephemeral: true });

                await RolesDB.create({ emote: emoteName, role: roleName });
                return interaction.reply("Role successfully added to the database.");
            } catch (err) {
                return interaction.reply({ content: "The role hasn't been added to the database.", ephemeral: true });
            }
        }
        else if (interaction.options.getSubcommand("remove")) {
            let emote = interaction.options.getString("emote"),
                regex = /<:.+:\d+>/,
                emoteName = regex.test(emote) ? emote.slice(emote.indexOf(":") + 1, emote.lastIndexOf(":")) : emote;

            try {
                const role = await RolesDB.findOne({ where: { emote: emoteName } });

                if (!role) return interaction.reply({ content: "Role doesn't exist in database.", ephemeral: true });

                await RolesDB.destroy({ where: { emote: emoteName } });

                return interaction.reply("Role was successfully deleted from database.");
            } catch (err) {
                return interaction.reply({ content: "Role wasn't deleted from database.", ephemeral: true });
            }
        }
    }
}

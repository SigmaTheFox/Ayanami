const { ComponentType, ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const list = Object.entries(require("../json/activities.json"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("activity")
        .setDescription("Get an invite link to a Discord VC activity. Unstable and might not always work.")
        .setDMPermission(false),
    /**
     * @param {Client} ayanami
     * @param {CommandInteraction} interaction
    */
    async execute(ayanami, interaction) {
        let id,
            filter = (i) => {
                i.deferUpdate();
                return i.customId === "activity" && i.user.id === interaction.user.id
            }
        // Create select menu
        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("activity")
                    .setPlaceholder("Select an activity"));

        // Loop through activity list and add each one to the select menu options
        for (let i of list) {
            if (i[0].toLowerCase().includes("game")) break;
            row.components[0].addOptions({ label: i[0], description: i[1].name, value: i[1].id })
        }

        // If the member using the interaction isn't in a VC, tell them to join one first
        if (!interaction.member?.voice?.channel) return interaction.reply("You must join a VC before using this command.");
        else id = interaction.member.voice.channel.id;

        // Send the select menu
        let m = await interaction.reply({ content: "Select an activity:", components: [row] })

        // Create a component collector that lasts 1 minute. Once a user has selected an activity, edit the reply to give the invite.
        let collector = m.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60000 });
        collector.on("collect", async i => {
            let activity = i.values[0];

            let res = await ayanami.rest.post(`/channels/${id}/invites`, {
                body: {
                    "max_age": 604800,
                    "max_uses": 0,
                    "target_application_id": activity,
                    "target_type": 2,
                    "temporary": false
                }
            });
            let inv = new Invite(ayanami, res);
            interaction.editReply({ content: inv.url, components: [] });
            collector.stop();
        });
        collector.on("end", collected => {
            if (collected.size === 0) interaction.editReply({ content: "No activity was selected", components: [] })
        })
    }
}

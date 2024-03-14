const {
	ApplicationCommandType,
	Client,
	ContextMenuCommandBuilder,
	ModalBuilder,
	ContextMenuCommandInteraction,
	PermissionFlagsBits,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} = require('discord.js');

module.exports = {
	global: false,
	modalIds: ['ban'],
	data: new ContextMenuCommandBuilder()
		.setName('ban')
		.setType(ApplicationCommandType.User)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false),
	/**
	 *
	 * @param {Client} ayanami
	 * @param {ContextMenuCommandInteraction} interaction
	 */
	async execute(ayanami, interaction) {
		// Check if the user is already banned or left
		if (!interaction.guild.members.cache.some(user => user.id === interaction.targetId))
			return interaction.reply({ content: "This user isn't in the server", ephemeral: true });

		let target = interaction.guild.members.cache.get(interaction.targetId);

		// Check if the user is bannable or the interaction user themselves
		if (!target.bannable || target.id === interaction.user.id)
			return interaction.reply({ content: "You can't ban this user.", ephemeral: true });

		/*
            Create the ban modal
            Add a text input to the modal for the ban Reason and how many days worth of messages should be deleted
            Add each text input to the respective Action Row
            Add the components to the modal and send it to the user
        */
		const modal = new ModalBuilder()
			.setCustomId('ban')
			.setTitle(`Banning ${interaction.user.globalName}`);

		const banReasonInput = new TextInputBuilder()
			.setCustomId('reason')
			.setLabel('Ban Reason')
			.setRequired(false)
			.setStyle(TextInputStyle.Paragraph);

		const deleteMessages = new TextInputBuilder()
			.setCustomId('msg_delete_days')
			.setLabel('Delete message history (in days)')
			.setValue('0')
			.setMinLength(1)
			.setMaxLength(2)
			.setStyle(TextInputStyle.Short);

		const BanReasonActionRow = new ActionRowBuilder().addComponents(banReasonInput);
		const DeleteMessagesActionRow = new ActionRowBuilder().addComponents(deleteMessages);

		modal.addComponents(BanReasonActionRow, DeleteMessagesActionRow);
		interaction.showModal(modal);

		// Wait for the modal to be submitted
		const modalFilter = interaction => interaction.customId === 'ban';
		const modalSubmit = await interaction.awaitModalSubmit({ modalFilter, time: 60_000 });

		const reason = modalSubmit.fields.getTextInputValue('reason') || 'Unspecified',
			time = parseInt(modalSubmit.fields.getTextInputValue('msg_delete_days'));

		// If the user to ban has DMs unlocked, send them a message telling them they have been banned with the reason for the ban
		try {
			await target.send(`You have been banned from Sigma's Den.\nReason: **${reason}**`);
		} catch (err) {
			console.log(
				`${
					target.user.globalName || target.id || target
				} has the DMs blocked. Couldn't send ban message.`
			);
			ayanami.logger.log(
				`${
					target.user.globalName || target.id || target
				} has the DMs blocked. Couldn't send ban message.`
			);
		} finally {
			// Finally send the user to the shadow realm
			target.ban({ reason: reason, deleteMessageSeconds: 60 * 60 * 24 * time }).then(
				modalSubmit.reply({
					content: `Banned ${target.user.globalName}`,
					ephemeral: true,
				})
			);
		}
	},
};

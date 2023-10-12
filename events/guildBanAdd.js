const { EmbedBuilder, Client, GuildBan } = require('discord.js');
/**
 * @param {Client} ayanami
 * @param {GuildBan} ban
 */
module.exports = async (ayanami, ban) => {
	await ban.fetch();

	let target = ban.user,
		reason = ban.reason ? ban.reason : 'Unspecified',
		channel = ayanami.channels.cache.get('783733205114421309');

	let embed = new EmbedBuilder()
		.setTitle('Ban')
		.setColor('#FF0000')
		.setFields(
			{ name: 'Member', value: `**${target.tag}** (${target.id})` },
			{ name: 'Reason', value: `**${reason}**` },
		)
		.setTimestamp();

	try {
		await target.send(
			`You have been banned from Sigma's Den.\nReason: **${reason}**`,
		);
	} catch (err) {
		console.log(
			`${
				user.username || user.id || user
			} has the DMs blocked. Couldn't send ban message.`,
		);
		ayanami.logger.log(
			`${
				user.username || user.id || user
			} has the DMs blocked. Couldn't send ban message.`,
		);
	} finally {
		channel.send({ embeds: [embed] });
		ayanami.users.cache.delete(target.user.id);
		ayanami.logger.log(
			`Banned user ${user.username || user.id || user.toString()}`,
		);
		console.log(`Banned user ${user.username || user.id || user.toString()}`);
	}
};

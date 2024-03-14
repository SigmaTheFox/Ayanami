const { EmbedBuilder, Client, GuildBan } = require('discord.js');
/**
 * @param {Client} ayanami
 * @param {GuildBan} ban
 */
module.exports = async (ayanami, ban) => {
	await ban.fetch();

	let target = ban.user,
		reason = ban.reason ? ban.reason : 'Unspecified',
		channel = ban.guild.channels.cache.find(channel => channel.name === 'admin-logs');

	let embed = new EmbedBuilder()
		.setTitle('Ban')
		.setColor('#FF0000')
		.setFields(
			{ name: 'Member', value: `**${target.globalName}** (${target.id})` },
			{ name: 'Reason', value: `**${reason}**` }
		)
		.setTimestamp();

	channel.send({ embeds: [embed] });
	ayanami.users.cache.delete(target.id);
	ayanami.logger.log(`Banned user ${target.globalName || target.id || target.toString()}`);
	console.log(`Banned user ${target.globalName || target.id || target.toString()}`);
};

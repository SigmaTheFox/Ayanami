const { Client, EmbedBuilder, GuildMember } = require("discord.js");

/**
 * @param {Client} ayanami
 * @param {GuildMember} oldMember
 * @param {GuildMember} newMember
 */
module.exports = async (ayanami, oldMember, newMember) => {
	if (!oldMember.isCommunicationDisabled() && newMember.isCommunicationDisabled()) {
		let target = newMember.user,
			time = newMember.communicationDisabledUntil,
			channel = ayanami.channels.cache.get("783733205114421309");

		let embed = new EmbedBuilder()
			.setTitle("Muted")
			.setColor("#00FF")
			.setFields(
				{ name: "Member", value: `**${target.tag}** (${target.id})` },
				{ name: "Until", value: time }
			)
			.setTimestamp();

		try {
			await target.send(`You've been muted on Sigma's Den.\nUntil: **${time}**`);
		} catch (err) {
			console.log(
				`${
					target.username || target.id || target.toString()
				} has the DMs blocked. Couldn't send mute message.`
			);
			ayanami.logger.log(
				`${
					target.username || target.id || target.toString()
				} has the DMs blocked. Couldn't send mute message.`
			);
		} finally {
			channel.send({ embeds: [embed] });
			ayanami.logger.log(`Muted ${target.tag} - ${target.id} until ${time}`);
			console.log(`Muted ${target.tag} - ${target.id} until ${time}`);
		}
	}
};

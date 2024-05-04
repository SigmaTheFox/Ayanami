const config = require('../settings/config.json');
const { Client, Message, ChannelType, ActionRowBuilder, ButtonBuilder } = require('discord.js');

/**
 * @param {Client} ayanami
 * @param {Message} message
 * @returns
 */
module.exports = async (ayanami, message) => {
	// Automatically publish free games
	if (
		message.channel.type === ChannelType.GuildAnnouncement &&
		message.channel.name === 'free-games' &&
		/https?:\/\//gi.test(message.content)
	)
		return message.crosspost();

	// Checks if message was sent by a bot.
	if (message.author.bot) return;

	// auto-fxTwitter
	if (
		message.member?.roles?.cache.find(r => r.name === 'fxtwitter') &&
		message.channel.type === ChannelType.GuildText
	) {
		let twitterRegex = /https?:\/\/(mobile\.|www\.)?(twitter|x).com\/\w+\/status\/\d+/gi,
			ignore = /<https?:\/\/(mobile\.|www\.)?(twitter|x).com/gi;

		if (twitterRegex.test(message.content) && !ignore.test(message.content)) {
			let tweets = message.content.match(twitterRegex),
				args = message.content.split(/\s+/),
				text = args.filter(i => !twitterRegex.test(i)).join(' '),
				msgContent = `FX-ed **${message.author.tag}**'s X(Twitter) link(s)\n`;

			if (text || text.length > 0) msgContent += `**Additional Text**:\n> ${text}\n`;

			for (let tweet of tweets) {
				if (/(fxtwitter.com|vxtwitter.com|fixupx.com)/.test(tweet)) continue;
				msgContent += `\n${tweet
					.toLowerCase()
					.replace(/(mobile\.|www\.)?(twitter|x)/i, 'fxtwitter')}`;
			}

			let row = new ActionRowBuilder().addComponents([
				new ButtonBuilder().setLabel('Delete').setStyle('Danger').setCustomId('delete'),
			]);

			let msg = await message.channel.send({
				content: msgContent,
				components: [row],
			});
			message.delete();

			let filter = interaction =>
				interaction.customId === 'delete' && interaction.user.id === message.author.id;
			let collector = msg.createMessageComponentCollector({
				filter,
				time: 60000,
			});
			collector.on('collect', () => msg.delete());
			collector.on('end', () => {
				msg.edit({ components: [] }).catch(() => {});
			});
		}
	}

	// Fetch channel if partial
	if (message.channel.partial) {
		try {
			await message.channel.commands.fetch();
		} catch (err) {
			ayanami.logger.error('Failed to fetch DM channel.');
			console.error('Failed to fetch DM channel');
		}
	}

	// Checks if the command starts with the prefix.
	if (!message.content.startsWith(config.prefix)) return;

	// Gets rid of the need of adding the prefix to startsWith().
	const args = message.content.slice(config.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Gets the command names and aliases.
	const command =
		ayanami.msgCommands.get(commandName) ||
		ayanami.msgCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	// Returns if there is no command with that name.
	if (!command)
		return message.reply(
			`There is no command called **${commandName}**. Make sure you typed the command correctly or ask Commander Sigma if he can add it.`
		);

	// Checks for arguments for the command.
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		// If the command has a usage value it'll tell the user how to use it properly.
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	// This will execute the command and if there was an error it'll tell the user.
	try {
		command.execute(ayanami, message, args);
	} catch (err) {
		ayanami.logger.error(err);
		message.reply('There was an error trying to execute that command!');
	}
};

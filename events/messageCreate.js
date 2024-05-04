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
		let twitterRegex =
			/https?:\/\/(mobile\.|www\.)?(twitter|x)\.com\/\w+\/status\/[0-9]{19}(?!>)/i;

		// Check if the message content has a tweet
		if (twitterRegex.test(message.content)) {
			/*
				- Get all tweets from the message content
				- split the message content
				- filter out every twitter.com or x.com link from the full message content
				- initialize the final message to be sent
			*/
			let tweets = message.content.match(RegExp(twitterRegex, 'gi')),
				args = message.content.split(/\s+/),
				text = args.filter(tweet => !twitterRegex.test(tweet)).join(' '),
				msgContent = `# FX-ed **${message.author.displayName}**'s X(Twitter) link(s)\n`;

			// If there is additional content, add a heading and the additional text to the message content
			if (text || text.length > 0) msgContent += `## Additional Text:\n> ${text}\n`;

			// Loop through the tweets and replace twitter and/or x with fxtwitter
			for (let tweet of tweets) {
				msgContent += `\n${tweet
					.toLowerCase()
					.replace(/(mobile\.|www\.)?(twitter|x)/i, 'fxtwitter')}`;
			}

			// Create the Delete button component
			let row = new ActionRowBuilder().addComponents([
				new ButtonBuilder().setLabel('Delete').setStyle('Danger').setCustomId('delete'),
			]);

			// Send final message content with the Delete button component
			let msg = await message.channel.send({
				content: msgContent,
				components: [row],
			});
			message.delete();

			// Handle the Delete button
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

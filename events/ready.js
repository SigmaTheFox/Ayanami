const cron = require('node-cron');

module.exports = (ayanami) => {
	ayanami.channels.cache
		.filter((c) => c.name === 'roles')
		.each((channel) => channel.messages.fetch());
	console.log(`Taste the power of the demon...!`);
	ayanami.logger.trace(`Taste the power of the demon...!`);

	cron.schedule('0 0 * * *', () => {
		require('../modules/getBirthdays')(ayanami);
	});

	let free_games_channel = ayanami.channels.cache.filter(
		(c) => c.name === 'free-games'
	);
	cron.schedule('15 15 * * *', () => {
		free_games_channel.each((channel) => {
			let free_games_role = channel.guild.roles.cache.find(
				(r) => r.name.toLowerCase() === 'free games'
			).id;

			require('../modules/games')(channel, `<@&${free_games_role}>`);
		});
	});
};

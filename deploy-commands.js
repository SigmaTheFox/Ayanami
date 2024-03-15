const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientID, guildID, privateGuildID, token } = require('./settings/config.json');
const fs = require('fs');

let globalCommands = [];
let guildCommands = [];
let privateCommands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if (command.global === true) globalCommands.push(command.data.toJSON());
	else if (command.global === false) guildCommands.push(command.data.toJSON());
	else if (command.private) privateCommands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(clientID), { body: globalCommands })
	.then(() => console.log('Successfully registered global commands.'))
	.catch(console.error);

rest.put(Routes.applicationGuildCommands(clientID, guildID), {
	body: guildCommands,
})
	.then(() => console.log('Successfully registered guild commands.'))
	.catch(console.error);

rest.put(Routes.applicationGuildCommands(clientID, privateGuildID), {
	body: privateCommands,
})
	.then(() => console.log('Successfully registered private commands.'))
	.catch(console.error);

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const { clientID, guildID, token } = require("./settings/config.json");
const fs = require("fs");

let globalCommands = [];
let guildCommands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.global === true) globalCommands.push(command.data.toJSON());
    else if (command.global === false) guildCommands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(clientID), { body: globalCommands })
    .then(() => console.log("Successfully registered global commands."))
    .catch(console.error);

rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: guildCommands })
    .then(() => console.log("Successfully registered guild commands."))
    .catch(console.error);

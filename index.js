const { Client, Options, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const config = require("./settings/config.json");

let intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent
];
// Creates a new client and a commands collection.
const ayanami = new Client({
    presence: {
        activities: [{
            name: "Real life is a shit-tier game"
        }]
    },
    intents: intents,
    partials: ["CHANNEL"],
    makeCache: Options.cacheWithLimits({
        MessageManager: 25
    })
});

ayanami.logger = require('./modules/logger');
ayanami.commands = new Collection();
ayanami.msgCommands = new Collection();

// Handle SlashCommands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    let command = require(`./commands/${file}`);
    ayanami.commands.set(command.data.name, command);
}

// Handle Message Commands
const msgCommandFiles = fs.readdirSync('./msgCommands').filter(file => file.endsWith('.js'));
for (const file of msgCommandFiles) {
    let command = require(`./msgCommands/${file}`);
    ayanami.msgCommands.set(command.name, command);
}

// Require and attach each event file to the appropriate event
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    let event = require(`./events/${file}`);
    let eventName = file.split(".")[0];

    // Load events and require the client name before the event outputs
    if (eventName !== "ready") ayanami.on(eventName, event.bind(null, ayanami));
    else ayanami.once(eventName, event.bind(null, ayanami));
    delete require.cache[require.resolve(`./events/${file}`)];
}

ayanami.login(config.token).catch(err => {
    console.error(err);
    ayanami.logger.error(err);
});


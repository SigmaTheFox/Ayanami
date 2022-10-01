const { Client, Options, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const config = require("./settings/config.json");
const { RolesDB } = require("./modules/dbObjects");

let intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildPresences
];
// Creates a new client and a commands collection.
const ayanami = new Client({
    presence: {
        activities: [{
            type: "PLAYING",
            name: "Use //help"
        }]
    },
    intents: intents,
    partials: ["CHANNEL"],
    makeCache: Options.cacheWithLimits({
        MessageManager: 50
    })
});

ayanami.logger = require('./modules/logger');
ayanami.commands = new Collection();

// Reads the commands directory and filters out everything that does not end with '.js'.
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    let command = require(`./commands/${file}`);
    ayanami.commands.set(command.data.name, command);
}

// Require and attach each event file to the appropriate event
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    let event = require(`./events/${file}`);
    let eventName = file.split(".")[0];

    // Load events and require the client name before the event outputs
    ayanami.on(eventName, event.bind(null, ayanami));
    delete require.cache[require.resolve(`./events/${file}`)];
}

ayanami.login(config.token).catch(err => {
    console.error(err);
    ayanami.logger.error(err);
});

ayanami.once('ready', async () => {
    ayanami.channels.cache.filter(c => c.name === "roles").each(channel => channel.messages.fetch())
    console.log(`Taste the power of the demon...!`);
    ayanami.logger.trace(`Taste the power of the demon...!`);
});

ayanami.on("messageReactionAdd", async (react, user) => {
    if (user.bot) return;

    if (react.message.channel.name === "roles") {
        const member = await react.message.guild.members.fetch(user.id);
        const findRole = react.message.guild.roles.cache;

        RolesDB.findOne({ where: { emote: react.emoji.name } })
            .then(Role => {
                if (!Role) return;
                member.roles.add(findRole.find(r => r.name === Role.role))
            })
    }
})

ayanami.on("messageReactionRemove", async (react, user) => {
    if (user.bot) return;

    if (react.message.channel.name === "roles") {
        const member = await react.message.guild.members.fetch(user.id);
        const findRole = react.message.guild.roles.cache;

        RolesDB.findOne({ where: { emote: react.emoji.name } })
            .then(Role => {
                if (!Role) return;
                member.roles.remove(findRole.find(r => r.name === Role.role))
            })
    }
})

const Discord = require("discord.js");
const fs = require("fs");
const config = require("./settings/config.json");
const { RolesDB } = require("./modules/dbObjects");

let intents = ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS", "GUILD_PRESENCES",
    "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"];
// Creates a new client and a commands collection.
const ayanami = new Discord.Client({
    presence: {
        activity: {
            type: "PLAYING",
            name: "Use //help"
        }
    },
    messageCacheMaxSize: 50,
    messageEditHistoryMaxSize: 2,
    ws: {
        intents
    }
});

ayanami.commands = new Discord.Collection();
ayanami.logger = require('./modules/logger');

// Reads the commands directory and filters out everything that does not end with '.js'.
const commandFile = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFile) {
    const command = require(`./commands/${file}`);
    ayanami.commands.set(command.name, command);
}

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    if (err) return ayanami.logger.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;

        let event = require(`./events/${file}`);
        let eventName = file.split(".")[0];

        // Loads event files and requires the client name before the event outputs
        ayanami.on(eventName, event.bind(null, ayanami));
        delete require.cache[require.resolve(`./events/${file}`)]
    });
});

// Obviously the bot login.
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
const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require("discord.js");
const { birthday } = require("../json/gifs.json");
const { randomKey } = require("../settings/config.json");
const RandomOrg = require("random-org");
const random = new RandomOrg({ apiKey: randomKey });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("birthday")
        .setDescription("Wish someone a happy birthday")
        .addUserOption(opt =>
            opt
                .setName("user")
                .setDescription("The user")
                .setRequired(false)),
    /**
     * @param {Client} ayanami
     * @param {CommandInteraction} interaction
     */
    async execute(ayanami, interaction) {
        let randomInt = await random.generateIntegers({ min: 0, max: birthday.length - 1, n: 1 }),
            imageURL = birthday[randomInt.random.data];
        ayanami.logger.info(`Generated number for birthday command: ${randomInt.random.data}`);

        const heart = ayanami.emojis.cache.get(require("../json/emojis.json").ayanamiheart);

        function sendEmbed(description) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: ayanami.user.username, iconURL: ayanami.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(description)
                .setImage(imageURL)
                .setColor(45055);
            interaction.reply({ embeds: [embed] });
        }

        const user = interaction.options.getMember("user")
        if (user && user.id === ayanami.user.id) sendEmbed(`Thank you very much for the birthday wishes ${user}. I'm very happy to be here with you all!`);
        else if (user) sendEmbed(`Happy birthday **${user}**!!! ${heart} Make sure to eat lots of cake! [Source](${imageURL})`);
        else {
            sendEmbed(`Happy birthday!!! ${heart}. [Source](${imageURL})`);
        }
    }
}

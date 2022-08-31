const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require("discord.js");
const Gifs = require("../json/gifs.json");
const { randomKey } = require("../settings/config.json");
const { baka } = require("../json/emojis.json");
const RandomOrg = require("random-org");
const random = new RandomOrg({ apiKey: randomKey });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("baka")
        .setDescription("It's not like I... Whatever")
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
        let randomInt = await random.generateIntegers({ min: 0, max: Gifs.baka.length - 1, n: 1 }),
            imageURL = Gifs.baka[randomInt.random.data];
        ayanami.logger.info(`Generated number for baka command: ${randomInt.random.data}`);

        function sendEmbed(description) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: ayanami.user.username, iconURL: ayanami.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(description)
                .setImage(imageURL)
                .setColor(45055);
            interaction.reply({ embeds: [embed] });
        }

        const user = interaction.options.getMember("user")
        if (user) sendEmbed(`**${user}** wa baka! ${ayanami.emojis.cache.get(baka)} [Source](${imageURL})`);
        else sendEmbed(`Baka baka baaaka!!! ${ayanami.emojis.cache.get(baka)} [Source](${imageURL})`);
    }
}

const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require("discord.js");
const Gifs = require("../json/gifs.json");
const { randomKey } = require("../settings/config.json");
const RandomOrg = require("random-org");
const random = new RandomOrg({ apiKey: randomKey });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gif")
        .setDescription("Send a reaction gif of a specific theme")
        .addSubcommand(cmd =>
            cmd
                .setName("baka")
                .setDescription("It's not like I... Whatever")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false)))
        .addSubcommand(cmd =>
            cmd
                .setName("birthday")
                .setDescription("Wish someone a happy birthday")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false)))
        .addSubcommand(cmd =>
            cmd
                .setName("bonk")
                .setDescription("Get bonked!")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false)))
        .addSubcommand(cmd =>
            cmd
                .setName("cuddle")
                .setDescription("You might think cudding is lewd, but no, cuddling is our energy source!")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false))),
    /**
     * @param {Client} ayanami
     * @param {CommandInteraction} interaction
     */
    async execute(ayanami, interaction) {
        function sendEmbed(description, image) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: ayanami.user.username, iconURL: ayanami.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(description)
                .setImage(image)
                .setColor(45055);
            interaction.reply({ embeds: [embed] });
        }
        async function getGif(gifName) {
            let gif = Gifs[gifName];
            let randomInt = await random.generateIntegers({ min: 0, max: gif.length - 1, n: 1 });
            ayanami.logger.info(`Generated number for ${gifName} command: ${randomInt.random.data}`);
            return gif[randomInt.random.data];
        }

        const user = interaction.options.getMember("user");
        let imageURL,
            emote;

        switch (interaction.options.getSubcommand()) {
            case "baka":
                imageURL = await getGif("baka");
                emote = ayanami.emojis.cache.get(require("../json/emojis.json").baka);
                if (user) sendEmbed(`**${user}** wa baka! ${emote} [Source](${imageURL})`, imageURL);
                else sendEmbed(`Baka baka baaaka!!! ${emote} [Source](${imageURL})`, imageURL);
                break;
            case "birthday":
                imageURL = await getGif("birthday");
                emote = ayanami.emojis.cache.get(require("../json/emojis.json").ayanamiheart);
                if (user && user.id === ayanami.user.id) sendEmbed(`Thank you very much for the birthday wishes ${interaction.user}. I'm very happy to be here with you all!`, imageURL);
                else if (user) sendEmbed(`Happy birthday **${user}**!!! ${emote} Make sure to eat lots of cake! [Source](${imageURL})`, imageURL);
                else sendEmbed(`Happy birthday!!! ${emote}. [Source](${imageURL})`, imageURL);
                break;
            case "bonk":
                imageURL = await getGif("bonk");
                if (user) sendEmbed(`${interaction.user} bonks **${user}** [Source](${imageURL})`, imageURL);
                else sendEmbed(`Get bonked! [Source](${imageURL})`, imageURL);
                break;
            case "cuddle":
                imageURL = await getGif("cuddle");
                emote = ayanami.emojis.cache.get(require("../json/emojis.json").ayanamiheart);
                if (user) sendEmbed(`${interaction.user} Cuddles with **${user}** ${emote} [Source](${imageURL})`, imageURL);
                else sendEmbed(`Cuddly snuggly!!! ${emote} [Source](${imageURL})`, imageURL);
                break;
        }
    }
}

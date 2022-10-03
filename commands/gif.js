const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require("discord.js");
const Gifs = require("../json/gifs.json");
const { randomKey } = require("../settings/config.json");
const RandomOrg = require("random-org");
const random = new RandomOrg({ apiKey: randomKey });

module.exports = {
    global: true,
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
                .setDescription("You might think cuddling is lewd, but no, cuddling is our energy source!")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false)))
        .addSubcommand(cmd =>
            cmd
                .setName("fuck")
                .setDescription("Fuck someone either out of love or because you're feeling horny")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false)))
        .addSubcommand(cmd =>
            cmd
                .setName("hug")
                .setDescription("Give someone a hug")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false)))
        .addSubcommand(cmd =>
            cmd
                .setName("kiss")
                .setDescription("Give someone a big ol' smooch")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false)))
        .addSubcommand(cmd =>
            cmd
                .setName("lewd")
                .setDescription("NOOO! This is too lewd!"))
        .addSubcommand(cmd =>
            cmd
                .setName("lick")
                .setDescription("Lick your friends")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false)))
        .addSubcommand(cmd =>
            cmd
                .setName("nom")
                .setDescription("Wanna have a bite?")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false)))
        .addSubcommand(cmd =>
            cmd
                .setName("pat")
                .setDescription("Pat and everything's find again")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false)))
        .addSubcommand(cmd =>
            cmd
                .setName("poke")
                .setDescription("Squishy :3")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false)))
        .addSubcommand(cmd =>
            cmd
                .setName("tickle")
                .setDescription("Bully someone with tickles!")
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

        const user = interaction.options.getUser("user");
        let imageURL,
            emote;

        switch (interaction.options.getSubcommand()) {
            case "baka":
                imageURL = await getGif("baka");
                emote = require("../json/emojis.json").baka;
                if (user) sendEmbed(`**${user}** wa baka! ${emote} [Source](${imageURL})`, imageURL);
                else sendEmbed(`Baka baka baaaka!!! ${emote} [Source](${imageURL})`, imageURL);
                break;
            case "birthday":
                imageURL = await getGif("birthday");
                emote = require("../json/emojis.json").ayanamiheart;
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
                emote = require("../json/emojis.json").ayanamiheart;
                if (user) sendEmbed(`${interaction.user} cuddles with **${user}** ${emote} [Source](${imageURL})`, imageURL);
                else sendEmbed(`Cuddly snuggly!!! ${emote} [Source](${imageURL})`, imageURL);
                break;
            case "fuck":
                if (interaction.inGuild() && !interaction.channel.nsfw) return interaction.reply("Commander... I know that you like exhibitionism... But please go have sex in the NSFW channels.");
                imageURL = await getGif("fuck");
                if (user && user.id === interaction.user.id) sendEmbed(`${interaction.user} fucked... themselves? I feel bad for you. [Source](${imageURL})`, imageURL);
                else if (user) sendEmbed(`${interaction.user} fucks **${user}**. [Source](${imageURL})`, imageURL);
                else sendEmbed(`${interaction.user} seems to be fucking a ghost. [Source](${imageURL})`, imageURL);
                break;
            case "hug":
                imageURL = await getGif("hug");
                emote = require("../json/emojis.json").ayanamiheart;
                if (user) sendEmbed(`${interaction.user} hugs **${user}** [Source](${imageURL})`, imageURL);
                else sendEmbed(`Huggies!!! ${emote} [Source](${imageURL})`, imageURL);
                break;
            case "kiss":
                imageURL = await getGif("kiss");
                emote = require("../json/emojis.json").ayanamiheart;
                if (user) sendEmbed(`${interaction.user} kisses ${emote} **${user}** [Source](${imageURL})`, imageURL);
                else sendEmbed(`You deserve a kiss :3 ${emote}. [Source](${imageURL})`, imageURL);
                break;
            case "lewd":
                imageURL = await getGif("lewd");
                emote = require("../json/emojis.json").vampirelewd;
                sendEmbed(`NO!!! This is too lewd!!! ${emote} [Source](${imageURL})`, imageURL);
                break;
            case "lick":
                imageURL = await getGif("lick");
                if (user) sendEmbed(`${interaction.user} licks **${user}** [Source](${imageURL})`, imageURL);
                else sendEmbed(`You taste delicious. [Source](${imageURL})`, imageURL);
                break;
            case "nom":
                imageURL = await getGif("nom");
                if (user) sendEmbed(`${interaction.user} noms on **${user}** [Source](${imageURL})`, imageURL);
                else sendEmbed(`Mmmh yummy. [Source](${imageURL})`, imageURL);
                break;
            case "pat":
                imageURL = await getGif("pat");
                emote = require("../json/emojis.json").dvapatpat;
                if (user) sendEmbed(`${interaction.user} pats **${user}** ${emote} [Source](${imageURL})`, imageURL);
                else sendEmbed(`Pat pat pat ${emote} [Source](${imageURL})`, imageURL);
                break;
            case "poke":
                imageURL = await getGif("poke");
                if (user) sendEmbed(`${interaction.user} pokes **${user}** [Source](${imageURL})`, imageURL);
                else sendEmbed(`Hehehe [Source](${imageURL})`, imageURL);
                break;
            case "tickle":
                imageURL = await getGif("tickle");
                if (user) sendEmbed(`${interaction.user} tickles **${user}** [Source](${imageURL})`, imageURL);
                else sendEmbed(`Tickle tickle tickle!!! [Source](${imageURL})`, imageURL);
                break;
        }
    }
}

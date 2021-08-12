const { MessageEmbed } = require('discord.js');
const { DeepLToken } = require("../settings/config.json");
const DeepL = require("../modules/DeepL");

module.exports = {
    name: "translate",
    aliases: ["tl"],
    args: true,
    category: "utility",
    description: "I'll translate a sentence to English for you.",
    usage: "<Sentence>",
    async execute(ayanami, message, args) {
        let input = args.join(" ");
        if (input.length > 1024) return message.channel.send("The text to translate can't be longer than 1024 characters.");
        
        try {
            let deepl = new DeepL(DeepLToken);
            let { text } = await deepl.translate(input, "EN");
            if (text.length > 1024) return message.channel.send("The translated text is longer than 1024 characters.\nYou might want to use https://translate.google.com");

            const embed = new MessageEmbed()
                .setColor(45055)
                .addField("Input Sentence", input)
                .addField("Translation", text);

            return message.channel.send({ embed: embed });
        } catch (err) {
            console.log(err)
            return message.channel.send("There was an error while translating. Try again later.");
        }
    }
}
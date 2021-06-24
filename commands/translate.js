const { MessageEmbed } = require('discord.js');
const translatte = require('translatte');

module.exports = {
    name: "translate",
    aliases: ["tl"],
    args: true,
    category: "utility",
    description: "I'll translate a sentence for you.",
    usage: "<Sentence>",
    async execute(ayanami, message, args) {
        let input = args.join(" ");
        try {
            let { text } = await translatte(input);

            const embed = new MessageEmbed()
                .setColor(45055)
                .addField("Input Sentence", input)
                .addField("Translation", text);
                
            return message.channel.send({ embed: embed });
        } catch (err) {
            return message.channel.send("There was an error while translating. Try again later.");
        }
    }
}
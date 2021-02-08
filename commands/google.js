const GoogleImages = require('google-images');
const { MessageAttachment } = require('discord.js');
const { CSEID, GAPI } = require('../settings/config.json');

const Google = new GoogleImages(CSEID, GAPI);

module.exports = {
    name: "google",
    aliases: ["g", "gm", "googleimage", "googleimg"],
    args: true,
    category: "utility",
    description: "I'll look for an image of what you typed.",
    usage: "<Search word>",
    async execute(ayanami, message, args) {
        async function search(word) {
            message.channel.startTyping();
            try {
                const results = await Google.search(word);
                if (!results.length) {
                    var reply = "No results";
                    message.channel.send(reply)
                        .then(message.channel.stopTyping());
                }
                else {
                    var reply = new MessageAttachment(results[Math.floor(Math.random() * results.length)].url, "image.jpg");
                    message.channel.send(reply)
                        .then(message.channel.stopTyping());
                }
            }
            catch (e) {
                console.error(e);
                message.channel.send("There was an error");
            }
        }

        search(args.join(" "))
    }
}
const { ownerID } = require("../settings/config.json");
const { Message } = require("discord.js")
const { splitMessage } = require("../modules/splitMessage.js");

function splitText(text, type) {
    let splitMsg;

    if (type === "text") splitMsg = splitMessage(text, { prepend: "\`\`\`js\n", append: "\n\`\`\`" });
    else if (type === "error") splitMsg = splitMessage(text, { prepend: "\`ERROR\`\n\`\`\`xl\n", append: "\n\`\`\`" });
    return splitMsg;
}

async function clean(client, text) {
    // If the input is a promise, await it first
    if (text && text.constructor.name == "Promise") text = await text;
    // Safely stringify response if it isn't a string
    if (typeof text !== "string") text = require("util").inspect(text, { depth: 1 });
    // Replace symbols
    text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    // Hide token in output
    text = text.replaceAll(client.token, "[REDACTED]");
    return text;
}

module.exports = {
    name: "eval",
    args: true,
    usage: "<Code>",
    /**
     * @param {*} ayanami 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    async execute(ayanami, message, args) {
        if (message.author.id !== ownerID) return message.reply("You're not my owner!");

        let evaled, cleaned;

        try {
            evaled = eval(args.join(" "));
            cleaned = await clean(ayanami, evaled);
            let split = splitText(cleaned, "text");

            for (msg of split) {
                message.channel.send(msg);
            }
        } catch (err) {
            let split = splitText(cleaned, "error");

            for (msg of split) {
                message.channel.send(msg)
            }
        }
    }
}

const { ownerID } = require("../settings/config.json");
const { Message } = require("discord.js")

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
    category: "admin",
    description: "**BOT OWNER ONLY** Execute code through discord",
    usage: "<Code>",
    /**
     * 
     * @param {*} ayanami 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    async execute(ayanami, message, args) {
        if (message.author.id !== ownerID) return message.reply("You're not my owner!");

        try {
            const evaled = eval(args.join(" "));
            const cleaned = await clean(ayanami, evaled);
            
            message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${cleaned}\n\`\`\``);
        }
    }
}
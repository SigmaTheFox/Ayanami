const { Invite } = require("discord.js");
const list = require("../json/activities.json");

module.exports = {
    name: "activity",
    aliases: ["activities"],
    args: true,
    category: "utility",
    description: "Get an invite link to a Discord VC activity. (Very unstable as it's not fully implemented yet, might not always work as intended.)",
    usage: "<activity> (VC ID)\nUse `//activity list` to see all valid activities.",
    async execute(ayanami, message, args) {
        if (message.channel.type !== "GUILD_TEXT") return message.channel.send("You can only use this command in the server.");

        try {
            let [activity, id] = args;
            if (activity.toLowerCase() === "list") return message.channel.send(Object.keys(list).map(name => `\`${name}\``).join(", "));
            if (!id && message.member?.voice?.channel) id = message.member.voice.channel.id

            let channel;
            try {
                channel = await ayanami.channels.fetch(id);
            } catch {
                return message.channel.send("The provided ID is invalid.\nJoin a VC before using this command or enable `Developer Mode` in the Behavior settings to copy a VC ID.");
            }

            if (!activity || !Object.keys(list).includes(activity)) return message.channel.send(`The provided activity isnis invalid.\nValid activities:\n${Object.keys(list).map(name => `\`${name}\``).join(", ")}`);
            if (!channel.isVoice()) return message.channel.send("You have to provide a VC ID.");

            let res = await ayanami.api.channels(id).invites.post({
                data: {
                    "max_age": 604800,
                    "max_uses": 0,
                    "target_application_id": list[activity].id,
                    "target_type": 2,
                    "temporary": false
                }
            });
            let inv = new Invite(ayanami, res);

            message.channel.send(`**${list[activity].name}:**${inv.url}`);
        } catch (err) {
            console.error(err);
            ayanami.logger.error(err);
            return message.channel.send("There was an error, try again later. If the issue persists, contact Sigma.")
        }
    }
}

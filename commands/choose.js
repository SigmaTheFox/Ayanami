module.exports = {
    name: "choose",
    category: "utility",
    description: "I'll pick for you.",
    aliases: ["pick", "random"],
    args: true,
    usage: "<option 1> | <option 2> ...",
    execute(ayanami, message, args) {
        const choices = args.join(" ").split(" | ");
        const random = choices[Math.floor(Math.random() * choices.length)];
        message.reply(random);
    }
}
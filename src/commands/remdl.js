const { Events } = require("../../dbObjects");

module.exports = {
    name: 'remdl',
    description: 'Removes a deadline',
    args: true,
    usage: '<deadline-name>',
    guildOnly: true,
    async execute(message, args) {
        const deadlineName = args.join(" ");

        const rowCount = await Events.destroy({ where: { name: deadlineName } });
        if (!rowCount) return message.reply(`\`'${deadlineName}' is not present in database. !deadlines to check all available names. Names are case-sensitive.\``);

        return message.reply(`\`'${deadlineName}' is deleted.\``);
    },
};
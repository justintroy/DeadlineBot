const Discord = require('discord.js');
const moment = require("moment");
const { Events } = require("../dbObjects");


const usageMessage = "Invalid args.\n```Usage: !newdl <date: MM/DD/YYYY> <time: HH:00> <AM/PM> <name>\nEx: !newdl 08/07/2021 7:00 PM Birthday```";
const dateFormat = ["MM/DD/YYYY h:mmA", "MM/DD h:mmA", "MM/DD/YYYY h:mmA"];

function extractEventName(arguments) {
    const name = arguments.replace(/\d{1,2}[\-|\.|\/]\d{1,2}[\-|\.|\/]\d{2,4}/g, "");
    const timeToRemove = moment(arguments, dateFormat).format("h:mm A");
    return name.replace(timeToRemove, "").trim();
}

function isValidDate(datestr) {
    const unixTimestamp = parseInt(moment(datestr, dateFormat).format("X"), 10);
    const unixTimestampToday = parseInt(moment().format("X"), 10);

    return unixTimestampToday > unixTimestamp;
}

module.exports = {
    name: 'newdl',
    description: 'Add a new deadline',
    args: true,
    usage: '<date: MM/DD/YYYY> <time: HH:00> <AM/PM> <name>',
    guildOnly: true,
    async execute(message, args) {
        if (args.length < 4) return message.reply(usageMessage);

        const argsStr = args.join(" ");

        let eventDate = moment(argsStr, dateFormat).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        if (!moment(eventDate, dateFormat).isValid()) return message.reply(usageMessage);
        if(!isValidDate(argsStr)) return message.reply(usageMessage);

        const eventTime = moment(argsStr, dateFormat).format("H mm");
        const eventName = extractEventName(argsStr);

        eventDate = moment(argsStr, dateFormat).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

        try {
            const event = await Events.create({
                name: eventName,
                creator: message.author.username,
                event_date: eventDate,
            });
            const eventDetails = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(eventName)
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(`Date: ${eventDate}\nTime: ${eventTime}\n\nDeadline '${event.name}' added.`);

            return message.reply(eventDetails);

        } catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") {
                return message.reply(`\`\`\`Name provided already exists.\`\`\``);
            }
            return message.reply(`\`\`\`Error ${e.message}\`\`\``);
        }
    },
};
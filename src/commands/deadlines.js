const { Events, sequelize } = require("../dbObjects");
const moment = require("moment");

module.exports = {
    name: 'deadlines',
    description: 'show all deadlines',
    args: false,
    //usage: '<no. of msg to purge>',
    guildOnly: true,
    async execute(message, args) {
        const eventDatas = await Events.findAll({
            attributes: ["name", "creator", "event_date"],
            order: sequelize.literal('datetime(event_date) ASC'),
        });

        const eventList = eventDatas.map(data => data.dataValues);

        const eventGrouped = eventList.reduce((acc, ele) => {
            const name = ele.name;
            const date = moment(ele.event_date, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMMM DD, YYYY");
            const time = moment(ele.event_date, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("h:mm A");
            
            if (!acc[date]) acc[date] = {};
            acc[date][time] ? acc[date][time].push(name) : acc[date][time] = [name];

            return acc;
        }, {});

        let eventsOutput = "";
        for (const [date, time] of Object.entries(eventGrouped)) {
            eventsOutput += `\n\n___${date}___`;
            for (const [hourMins, names] of Object.entries(time)) {
                eventsOutput += `\n     ${hourMins}`;
                
                if (names.length > 1) {
                    for (const eventnames of names) {
                        eventsOutput += `\n        -> **${eventnames}**`;
                    }
                } else {
                    eventsOutput += `\n        -> **${names}**`;
                }
            }
        }
        return message.channel.send(`DEADLINES:${eventsOutput}`);
    },
};
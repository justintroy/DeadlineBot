module.exports = {
	name: 'purge',
    description: 'Purges/Clears the chat',
    args: true,
    usage: '<no. of msg to purge>',
    guildOnly: true,
	execute(message, args) {
        if (isNaN(args[0])) return message.channel.send("```Please supply a valid amount of messages to purge.```");
        if (args[0] > 100) return message.channel.send("```Please supply a number less than 100.```");
        message.channel.bulkDelete(args[0])
            .then( messages => message.channel.send(`**Successfully deleted \`${messages.size}/${args[0]}\` messages. This message will be removed shortly.**`)
                .then( msg => msg.delete({ timeout: 1000 })))
            .catch( error => message.channel.send(`**ERROR:** ${error.message}`));
	},
};
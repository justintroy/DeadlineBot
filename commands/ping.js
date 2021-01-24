module.exports = {
	name: 'ping',
	description: 'Ping!',
	args: false,
	guildOnly: true,
	execute(message, args) {
		return message.channel.send('ping-pong.');
	},
};
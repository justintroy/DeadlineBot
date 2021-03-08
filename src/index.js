const fs = require('fs');
const Discord = require('discord.js');
const { sequelize } = require("./dbObjects");
const { prefix, token } = require('../config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.once('ready', async () => {
    await sequelize.sync({ force: true });
    console.log(`Logged in as ${client.user.tag}!`);
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (!command) return;

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nUSAGE: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('```I can\'t execute commands inside DMs!```');
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('```There was an error trying to execute that command!```');
    }
});

client.login(token);

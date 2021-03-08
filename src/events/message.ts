import fs from 'fs';
import Discord from 'discord.js';
import { prefix } from "../../config.json";

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js' || '.ts'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (!command || !message.content.startsWith(prefix) || message.author.bot) return;

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
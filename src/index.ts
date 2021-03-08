import fs from 'fs';
import Discord from 'discord.js';
import { sequelize } from "./dbObjects";
import { token } from '../config.json';

const client = new Discord.Client();

client.once('ready', async () => {
    await sequelize.sync({ force: true });
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);
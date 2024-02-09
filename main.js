import * as Discord from 'discord.js';
import fs from 'fs';

import config from './data/config.js';
import { Client } from '../../Confidence/blacket/utils/client/index.js';

const client = new Discord.Client({
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.GuildMessageReactions,
		Discord.GatewayIntentBits.MessageContent,
		Discord.GatewayIntentBits.GuildMembers,
		Discord.GatewayIntentBits.GuildPresences
	]
});

client.commands = new Discord.Collection();

const blacket = new Client({
	instance: 'blacket.org'
});

blacket.on('connected', async (e) => {
	for (const file of fs.readdirSync('./commands')) {
		const command = await import(`./commands/${file}`);
		client.commands.set(command.default.deploy.name, command.default);
	}

	for (const file of fs.readdirSync('./events').filter(file => file.endsWith('.js'))) {
		const event = await import(`./events/${file}`);
		client.on(file.split('.')[0], (eventData) => event.default(client, blacket, eventData));
	};

	client.login(config.token);
});

blacket.login(config.client);

export default client;
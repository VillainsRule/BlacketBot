import * as Discord from 'discord.js';
import fs from 'fs';

import config from '../data/config.js';

export default async function (client, blacket, _) {
    client.user.setActivity('the Blacket API!', {
        type: Discord.ActivityType.Watching
    });

    client.user.setStatus('dnd');
    console.log(`Connected to ${client.user.tag}!\nServer Count: ${client.guilds.cache.map(guild => guild.id).length}!`)

    const commands = [];

    for (const file of fs.readdirSync(`./commands`)) {
        const command = await import(`../commands/${file}`);
        if (command.default.deploy && !command.default.ignore) commands.push(command.default.deploy.toJSON());
    }

    const rest = new Discord.REST({
        version: '10'
    }).setToken(config.token);

    rest.put(Discord.Routes.applicationCommands(config.clientId), {
        body: commands
    }).then((data) => console.log(`\nCommands loaded! (${data.length})`)).catch(console.error);
};
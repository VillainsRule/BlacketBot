import * as discord from 'discord.js';
import fs from 'fs';

export default async function (client, blacket, interaction) {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        await interaction.deferReply();
        if (command) await command.run(interaction, client, blacket);
    } else if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isModalSubmit()) {
        if (interaction.message.interaction && (interaction.message.interaction?.user.id !== interaction.user.id)) return interaction.reply({
            embeds: [new discord.EmbedBuilder().setDescription(`**You cannot interact with another user's command.**`)],
            ephemeral: true
        });

        if (fs.existsSync(`./events/interactions/${interaction.customId.split('-')[0]}.js`))
            (await import(`./interactions/${interaction.customId.split('-')[0]}.js`)).default(interaction, client, blacket);

        else interaction.reply({
            embeds: [
                new discord.EmbedBuilder().setDescription(`**I cannot find the ${interaction.customId.split('-')[0]} interaction.**`)
            ],
            ephemeral: true
        });
    }
};
import * as discord from 'discord.js';

export default {
    deploy: new discord.SlashCommandBuilder()
        .setName(`blook`)
        .setDescription(`Get information on a Blacket Blook.`),

    async run(interaction, client, blacket) {
        let button = new discord.ButtonBuilder()
            .setCustomId(`blook-select`)
            .setLabel(`Blook Selector`)
            .setStyle(discord.ButtonStyle.Primary);

        interaction.editReply({
            components: [
                new discord.ActionRowBuilder().addComponents(button)
            ]
        });
    }
}
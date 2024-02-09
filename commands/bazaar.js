import * as discord from 'discord.js';

export default {
    deploy: new discord.SlashCommandBuilder()
        .setName(`bazaar`)
        .setDescription(`Get information on the Blacket Bazaar.`),

    async run(interaction, client, blacket) {
        let recent = new discord.ButtonBuilder()
            .setCustomId(`bazaar-recent`)
            .setLabel(`Recent Offers`)
            .setStyle(discord.ButtonStyle.Primary);

        let user = new discord.ButtonBuilder()
            .setCustomId(`bazaar-user-select`)
            .setLabel(`User Offers`)
            .setStyle(discord.ButtonStyle.Secondary);

        let blook = new discord.ButtonBuilder()
            .setCustomId(`bazaar-blook-select`)
            .setLabel(`Blook Offers`)
            .setStyle(discord.ButtonStyle.Secondary);

        interaction.editReply({
            embeds: [
                new discord.EmbedBuilder()
                    .setTitle(`The Blacket Bazaar`)
                    .setDescription(`**Use the buttons to navigate.**\nThe bazaar will not show over 18 entries.`)
            ],
            components: [
                new discord.ActionRowBuilder()
                    .addComponents(recent)
                    .addComponents(user)
                    .addComponents(blook)
            ]
        });
    }
}
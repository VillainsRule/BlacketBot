import * as discord from 'discord.js';
import emojis from '../data/emojis.js';

export default {
    deploy: new discord.SlashCommandBuilder()
        .setName(`badge`)
        .setDescription(`Get information on a Blacket badge.`),

    async run(interaction, client, blacket) {
        let badges = await blacket.badges();

        let actionRows = [new discord.ActionRowBuilder(), new discord.ActionRowBuilder(), new discord.ActionRowBuilder(), new discord.ActionRowBuilder()];
        Object.entries(badges).forEach((badge, index) => actionRows[Math.floor(index / 5) % 4].addComponents(
            new discord.ButtonBuilder()
                .setCustomId(`badge-${badge[0]}`)
                .setEmoji(emojis[badge[0]])
                .setStyle(discord.ButtonStyle.Secondary)
        ));

        interaction.editReply({
            embeds: [
                new discord.EmbedBuilder()
                    .setTitle('Badges')
                    .setDescription('Click a Badge to learn more about it.')
            ],
            components: actionRows
        });
    }
}
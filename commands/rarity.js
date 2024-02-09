import * as discord from 'discord.js';
import emojis from '../data/emojis.js';

export default {
    deploy: new discord.SlashCommandBuilder()
        .setName(`rarity`)
        .setDescription(`Get information on a Blacket Blook.`),

    async run(interaction, client, blacket) {
        let common = new discord.ButtonBuilder()
            .setCustomId(`rarity-Common`)
            .setLabel(`Common`)
            .setEmoji(emojis.Common)
            .setStyle(discord.ButtonStyle.Secondary);

        let uncommon = new discord.ButtonBuilder()
            .setCustomId(`rarity-Uncommon`)
            .setLabel(`Uncommon`)
            .setEmoji(emojis.Uncommon)
            .setStyle(discord.ButtonStyle.Secondary);

        let rare = new discord.ButtonBuilder()
            .setCustomId(`rarity-Rare`)
            .setLabel(`Rare`)
            .setEmoji(emojis.Rare)
            .setStyle(discord.ButtonStyle.Secondary);

        let epic = new discord.ButtonBuilder()
            .setCustomId(`rarity-Epic`)
            .setLabel(`Epic`)
            .setEmoji(emojis.Epic)
            .setStyle(discord.ButtonStyle.Secondary);

        let legendary = new discord.ButtonBuilder()
            .setCustomId(`rarity-Legendary`)
            .setLabel(`Legendary`)
            .setEmoji(emojis.Legendary)
            .setStyle(discord.ButtonStyle.Secondary);

        let chroma = new discord.ButtonBuilder()
            .setCustomId(`rarity-Chroma`)
            .setLabel(`Chroma`)
            .setEmoji(emojis.Chroma)
            .setStyle(discord.ButtonStyle.Secondary);

        let mystical = new discord.ButtonBuilder()
            .setCustomId(`rarity-Mystical`)
            .setLabel(`Mystical`)
            .setEmoji(emojis.Mystical)
            .setStyle(discord.ButtonStyle.Secondary);

        let iridescent = new discord.ButtonBuilder()
            .setCustomId(`rarity-Iridescent`)
            .setLabel(`Iridescent`)
            .setEmoji(emojis.Iridescent)
            .setStyle(discord.ButtonStyle.Secondary);

        let quit = new discord.ButtonBuilder()
            .setCustomId('rarity-quit')
            .setLabel('Quit')
            .setStyle(discord.ButtonStyle.Danger);

        interaction.editReply({
            components: [
                new discord.ActionRowBuilder()
                    .addComponents(common)
                    .addComponents(uncommon)
                    .addComponents(rare),
                new discord.ActionRowBuilder()
                    .addComponents(epic)
                    .addComponents(legendary)
                    .addComponents(chroma),
                new discord.ActionRowBuilder()
                    .addComponents(mystical)
                    .addComponents(iridescent)
                    .addComponents(quit)
            ]
        });
    }
}
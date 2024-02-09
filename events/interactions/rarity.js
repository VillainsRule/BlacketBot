import * as discord from 'discord.js';
import emojis from '../../data/emojis.js';

export default async function (interaction, client, blacket) {
    if (interaction.customId.includes('quit')) {
        interaction.deferUpdate();
        interaction.message.delete();
    } else if (interaction.customId.includes('back')) {
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

        interaction.message.edit({
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

        interaction.deferUpdate()
    } else {
        let rarities = await blacket.rarities();
        let blooks = await blacket.blooks();
        let chosenRarity = interaction.customId.split('-')[1].charAt(0).toUpperCase() + interaction.customId.split('-')[1].slice(1);
        let rarity = rarities[chosenRarity];

        interaction.message.edit({
            embeds: [
                new discord.EmbedBuilder()
                    .setTitle(`${chosenRarity} Rarity!`)
                    .addFields({
                        name: 'EXP Gained',
                        value: `${emojis.EXP} ${rarity.exp.toLocaleString()}`,
                        inline: true
                    }, {
                        name: `${chosenRarity} Blook #`,
                        value: `${emojis[chosenRarity]} ${Object.values(blooks).filter(a => a.rarity === chosenRarity).length.toLocaleString()}`,
                        inline: true
                    })
                    .setColor(rarity.color === 'rainbow' ? 'Random' : rarity.color)
            ],
            components: [
                new discord.ActionRowBuilder()
                    .addComponents(
                        new discord.ButtonBuilder()
                            .setCustomId(`rarity-back`)
                            .setLabel(`Back`)
                            .setStyle(discord.ButtonStyle.Secondary))
                    .addComponents(
                        new discord.ButtonBuilder()
                            .setCustomId(`rarity-quit`)
                            .setLabel(`Quit`)
                            .setStyle(discord.ButtonStyle.Danger)),
            ]
        });

        interaction.deferUpdate();
    }
}
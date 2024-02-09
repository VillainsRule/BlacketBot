import * as discord from 'discord.js';
import emojis from '../../data/emojis.js';

export default async function (interaction, client, blacket) {
    if (interaction.customId.includes('quit')) {
        interaction.deferUpdate();
        interaction.message.delete();
    } else if (interaction.customId.includes('back')) {
        let badges = await blacket.badges();
        
        let actionRows = [ new discord.ActionRowBuilder(), new discord.ActionRowBuilder(), new discord.ActionRowBuilder(), new discord.ActionRowBuilder() ];
        Object.entries(badges).forEach((badge, index) => actionRows[Math.floor(index / 5) % 4].addComponents(
            new discord.ButtonBuilder()
                .setCustomId(`badge-${badge[0]}`)
                .setEmoji(emojis[badge[0]])
                .setStyle(discord.ButtonStyle.Secondary)
        ));
        
        interaction.message.edit({
            embeds: [
                new discord.EmbedBuilder()
                    .setTitle('Badges')
                    .setDescription('Click a Badge to learn more about it.')
            ],
            components: actionRows
        });

        interaction.deferUpdate();
    } else {
        let badge = interaction.customId.split('-')[1].replace(/[-]/g, ' ');

        let badges = await blacket.badges();

        interaction.message.edit({
            embeds: [
                new discord.EmbedBuilder()  
                    .setTitle(`${badge} Badge`)
                    .setDescription(`> ${badges[badge].description}`)
                    .setThumbnail(`https://blacket.org${badges[badge].image.replace(/[\s]/g, '%20')}`)
            ],
            components: [
                new discord.ActionRowBuilder()
                    .addComponents(
                        new discord.ButtonBuilder()
                            .setCustomId(`badge-back`)
                            .setLabel(`Back`)
                            .setStyle(discord.ButtonStyle.Secondary))
                    .addComponents(
                        new discord.ButtonBuilder()
                            .setCustomId(`badge-quit`)
                            .setLabel(`Quit`)
                            .setStyle(discord.ButtonStyle.Danger)),
            ]
        })

        interaction.deferUpdate();
    }
}
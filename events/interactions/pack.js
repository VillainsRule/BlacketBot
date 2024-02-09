import * as discord from 'discord.js';
import emojis from '../../data/emojis.js';

export default async function (interaction, client, blacket) {
    let pack = interaction.values?.[0] || interaction.customId?.split('pack-')?.[1];

    if (pack === 'quit') {
        interaction.deferUpdate();
        interaction.message.delete();
    } else if (pack === 'back') {
        let packEmojis = {
            'OG': emojis.acai,
            'Gemstone': emojis.Amethyst,
            'Outback': emojis.Crocodile,
            'Aquatic': emojis.Dolphin,
            'Sports': emojis['Football Helmet'],
            'Breakfast': emojis['French Toast'],
            'Spooky': emojis.Ghost,
            'Ankha': emojis['Golden Ankha'],
            'Blizzard': emojis['Golden Gift'],
            'Fruit': emojis.Grape,
            'Candy': emojis['Gummy Worm'],
            'Ice Monster': emojis['Ice Elemental'],
            'Medieval': emojis.King,
            'Safari': emojis.Lion,
            'Combat': emojis['Knight Sword'],
            'Wonderland': emojis['Mad Hatter'],
            'Bot': emojis['Mega Bot'],
            'Elemental': emojis['Plasma Elemental'],
            'Summer': emojis.Popsicle,
            'Color': emojis['Red Blook'],
            'Video Game': emojis['Space Invader'],
            'Space': emojis['Space Terminal'],
            'Dino': emojis['Triceratops'],
            'Music': emojis['White Piano']
        };

        let dropdown = new discord.StringSelectMenuBuilder()
            .setCustomId('pack-drop')
            .setPlaceholder('Select a pack...');
        
        Object.entries(packEmojis).forEach((emoji, index) => dropdown.addOptions(
            new discord.StringSelectMenuOptionBuilder()
                .setLabel(emoji[0])
                .setValue(emoji[0])
                .setEmoji(emoji[1])
        ));

        let button = new discord.ButtonBuilder()
            .setCustomId(`pack-quit`)
            .setLabel(`Quit`)
            .setStyle(discord.ButtonStyle.Danger);

        interaction.message.edit({
            embeds: [],
            components: [
                new discord.ActionRowBuilder().addComponents(dropdown),
                new discord.ActionRowBuilder().addComponents(button)
            ]
        });

        interaction.deferUpdate();
    } else {
        let packs = await blacket.packs();
        let blooks = await blacket.blooks();

        let packInfo = Object.entries(packs).reduce((acc, [packName, packData]) => ({
            ...acc,
            [packName.toLowerCase()]: {
                ...packData,
                name: packName
            }
        }), {})[pack.toLowerCase()];

        let blookString = packInfo.blooks.map(a => a = `${emojis[blooks[a].rarity]} ${a} (${blooks[a].chance}%)`).join('\n');

        interaction.message.edit({
            embeds: [
                new discord.EmbedBuilder()
                    .setTitle(`${pack} Pack`)
                    .setThumbnail(`https://blacket.org${packInfo.image.replaceAll(' ', '%20')}`)
                    .setColor(packInfo.color1)
                    .addFields({
                        name: `Price`,
                        value: `${emojis.Token} ${packInfo.price}`
                    }, {
                        name: 'Blooks',
                        value: blookString.length > 1000 ? 'Too long to be displayed.' : blookString
                    })
            ],
            components: [
                new discord.ActionRowBuilder()
                    .addComponents(
                        new discord.ButtonBuilder()
                            .setCustomId(`pack-back`)
                            .setLabel(`Back`)
                            .setStyle(discord.ButtonStyle.Secondary))
                    .addComponents(
                        new discord.ButtonBuilder()
                            .setCustomId(`pack-quit`)
                            .setLabel(`Quit`)
                            .setStyle(discord.ButtonStyle.Danger)),
            ]
        })

        interaction.deferUpdate();
    }
}
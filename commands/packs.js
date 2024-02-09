import * as discord from 'discord.js';
import emojis from '../data/emojis.js';

export default {
    deploy: new discord.SlashCommandBuilder()
        .setName(`packs`)
        .setDescription(`Blacket Packs.`),

    async run(interaction, client, blacket) {
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

        interaction.editReply({
            components: [
                new discord.ActionRowBuilder().addComponents(dropdown),
                new discord.ActionRowBuilder().addComponents(button)
            ]
        });
    }
}
import * as discord from 'discord.js';
import axios from 'axios';

import emojis from '../../data/emojis.js';

export default async function (interaction, client, blacket) {
    if (interaction.customId.includes('select')) {
        let modal = new discord.ModalBuilder()
            .setCustomId('blook-modal')
            .setTitle('Blook Selector')
            .addComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('blook-modal-input')
                        .setLabel('Enter a Blook Name:')
                        .setStyle(discord.TextInputStyle.Short)
                        .setMinLength(3)
                        .setMaxLength(30)
                        .setRequired(true)));
        
        interaction.showModal(modal);
    } else if (interaction.customId.includes('modal')) {
        interaction.deferUpdate();
        
        let axiosReq = await axios.get('https://tremblero.github.io/collectibles/blacket/values.json');
        let values = axiosReq.data;

        let blooks = await blacket.blooks();
        let blook = blooks[interaction.fields.getTextInputValue('blook-modal-input')];
        
        let tryAgain = new discord.ButtonBuilder()
            .setCustomId(`blook-select`)
            .setLabel(`Select New Blook`)
            .setStyle(discord.ButtonStyle.Danger);

        if (!blook) return interaction.message.edit({
            embeds: [
                new discord.EmbedBuilder()
                    .setDescription('That Blook does not exist.')
                    .setColor('#ff0000')
            ],
            components: [ new discord.ActionRowBuilder().addComponents(tryAgain) ]
        });

        let getNew = new discord.ButtonBuilder()
            .setCustomId(`blook-select`)
            .setLabel(`Select New Blook`)
            .setStyle(discord.ButtonStyle.Primary);

        let value = values.filter(a => a.name === interaction.fields.getTextInputValue('blook-modal-input'))?.[0];
                
        interaction.message.edit({
            embeds: [
                new discord.EmbedBuilder()
                    .setTitle(interaction.fields.getTextInputValue('blook-modal-input'))
                    .setThumbnail(`https://blacket.org${blook.image.replaceAll(' ', '%20')}`)
                    .addFields({
                        name: 'Rarity',
                        value: `${emojis[blook.rarity]} ${blook.rarity}`,
                        inline: true
                    }, {
                        name: 'Pack',
                        value: `<:openedIcon:1145210877222600725> ${blook.art === '' ? 'none' : blook.art.split('.')[0].split('/')[4]}`,
                        inline: true
                    }, {
                        name: 'Drop Rate',
                        value: `${blook.chance >= 100 ? 'N/A' : blook.chance.toString() + '%'}`,
                        inline: true
                    }, {
                        name: 'Sell Price',
                        value: `${emojis.Token} ${blook.price.toLocaleString()}`,
                        inline: true
                    }, {
                        name: 'Trade Price',
                        value: `${emojis.Token} ${value?.rap?.toLocaleString() || 'Unknown'}`,
                        inline: true
                    }, {
                        name: 'Largest Hoard',
                        value: `${emojis['Big Spender']} ${value?.hoard?.amount?.toLocaleString() || 'Unknown'} ${value ? `(${values.filter(a => a.name === interaction.fields.getTextInputValue('blook-modal-input'))[0].hoard.user})` : ''}`,
                        inline: true
                    })
            ],
            components: [ new discord.ActionRowBuilder().addComponents(getNew) ]
        });
    }
}
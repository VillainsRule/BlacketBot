import * as discord from 'discord.js';
import emojis from '../../data/emojis.js';

export default async function (interaction, client, blacket) {
    if (interaction.customId.includes('recent')) {
        let bazaar = await blacket.bazaar.recent();
        bazaar = bazaar.bazaar.slice(0, 18)

        let embed = new discord.EmbedBuilder()
            .setTitle('Recent Bazaar Offers');
        
        bazaar.forEach(item => embed.addFields({
            name: `${emojis[item.item] || emojis.Error} ${item.item}`,
            value: ` ${emojis.Blank} ${emojis.Token} **${item.price.toLocaleString()}**${emojis.Blank}\n** ${emojis.Blank} ${emojis['Bazaar Icon']} ${item.seller}**`,
            inline: true
        }))

        interaction.message.edit({
            embeds: [ embed ]
        })

        interaction.deferUpdate();
    } else if (interaction.customId.includes('user-select')) {
        let modal = new discord.ModalBuilder()
            .setCustomId('bazaar-user-modal')
            .setTitle('User Selector')
            .addComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('bazaar-user-input')
                        .setLabel('Enter a Username to lookup:')
                        .setStyle(discord.TextInputStyle.Short)
                        .setMinLength(1)
                        .setMaxLength(16)
                        .setRequired(true)));
        
        interaction.showModal(modal);
    } else if (interaction.customId.includes('user-modal')) {
        let user = await blacket.user(interaction.fields.getTextInputValue('bazaar-user-input'));

        if (user.error) {
            interaction.message.edit({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle('That user does not exist.')
                        .setTimestamp()
                        .setColor('#ff0000')
                ]
            });
            interaction.deferUpdate();
            return;
        }

        let bazaar = await blacket.bazaar.getUser(user.user.id);

        if (bazaar.bazaar.length < 1) {
            interaction.message.edit({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle(`${user.user.username} has no offers.`)
                        .setTimestamp()
                        .setColor('#ff0000')
                ]
            });
            interaction.deferUpdate();
            return;
        }

        bazaar = bazaar.bazaar.slice(0, 18);

        let embed = new discord.EmbedBuilder()
            .setTitle(`${user.user.username}'s Bazaar Offers`);
        
        bazaar.forEach(item => embed.addFields({
            name: `${emojis[item.item] || emojis.Error} ${item.item}`,
            value: ` ${emojis.Blank} ${emojis.Token} **${item.price.toLocaleString()}**${emojis.Blank}`,
            inline: true
        }))

        interaction.message.edit({
            embeds: [ embed ]
        })

        interaction.deferUpdate();
    } else if (interaction.customId.includes('blook-select')) {
        let modal = new discord.ModalBuilder()
            .setCustomId('bazaar-blook-modal')
            .setTitle('Blook Selector')
            .addComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('bazaar-blook-input')
                        .setLabel('Enter a Blook Name:')
                        .setStyle(discord.TextInputStyle.Short)
                        .setMinLength(3)
                        .setMaxLength(30)
                        .setRequired(true)));
        
        interaction.showModal(modal);
    } else if (interaction.customId.includes('blook-modal')) {
        let blooks = await blacket.blooks();
        let blook = blooks[interaction.fields.getTextInputValue('bazaar-blook-input')];

        if (!blook) {
            interaction.message.edit({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle('That blook does not exist.')
                        .setTimestamp()
                        .setColor('#ff0000')
                ]
            });
            interaction.deferUpdate();
            return;
        }

        let bazaar = await blacket.bazaar.get(interaction.fields.getTextInputValue('bazaar-blook-input'));

        if (bazaar.bazaar.length < 1) {
            interaction.message.edit({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle(`There are no offers for ${blook}.`)
                        .setTimestamp()
                        .setColor('#ff0000')
                ]
            });
            interaction.deferUpdate();
            return;
        }

        bazaar = bazaar.bazaar.slice(0, 18);

        let embed = new discord.EmbedBuilder()
            .setTitle(`${interaction.fields.getTextInputValue('bazaar-blook-input')} Bazaar Offers`);
        
        bazaar.forEach(item => embed.addFields({
            name: `${emojis['Bazaar Icon']} ${item.seller}`,
            value: ` ${emojis.Blank} ${emojis.Token} **${item.price.toLocaleString()}**${emojis.Blank}`,
            inline: true
        }))

        interaction.message.edit({
            embeds: [ embed ]
        })

        interaction.deferUpdate();
    } 
}
import * as discord from 'discord.js';
import axios from 'axios';
import emojis from '../../data/emojis.js';

export default async function (interaction, client, blacket) {
    let user = await blacket.user(interaction.customId.match(/-(.*)-/)[1]);

    if (user.error) return await interaction.message.edit({
        embeds: [
            new discord.EmbedBuilder()
                .setDescription(`${emojis.Error} **Error: ${user.reason}**`)
                .setColor(`#ff0000`)
        ],
        ephemeral: true
    });

    user = user.user;

    let packList = await blacket.packs();
    let blookList = await blacket.blooks();

    let axiosReq = await axios.get('https://tremblero.github.io/collectibles/blacket/values.json');
    let values = axiosReq.data;

    let tradeValue = 0;
    Object.entries(user.blooks)
        .filter(b => values.find(v => v.name === b[0]))
        .filter(b => !isNaN(values.find(a => a.name === b[0]).rap))
        .forEach(entry => tradeValue += values.find(a => a.name === entry[0]).rap * entry[1]);

    let sellValue = 0;
    Object.entries(user.blooks).forEach(entry => sellValue += (entry[1] * blookList[entry[0]].price));

    let packData = {};

    Object.entries(packList).forEach(pack => {
        packData[pack[0]] = [];
        pack[1].blooks.forEach((blook) => {
            if (Object.keys(user.blooks).includes(blook)) packData[pack[0]].push({
                name: blook,
                qty: user.blooks[blook],
                rarity: blookList[blook].rarity
            });
        });
    });

    packData['Misc'] = [];
    let miscBlooks = Object.keys(user.blooks).filter(blook => !Object.values(packList).map(a => a.blooks).flat().includes(blook));
    miscBlooks.forEach(blook => {
        packData['Misc'].push({
            name: blook,
            qty: user.blooks[blook],
            rarity: blookList[blook].rarity
        });
    });

    const chunks = Array.from({
        length: Math.ceil(Object.entries(packData).length / 6)
    }, (_, index) => Object.fromEntries(Object.entries(packData).slice(index * 6, index * 6 + 6)));

    const createField = (chunk) => {
        return {
            name: `__\`  ${chunk[0]}  \`__`,
            value: chunk[1].map((blook) => `${emojis[blook.rarity]} \`${blook.qty}x\` ${blook.name}`).join('\n'),
            inline: true
        };
    };

    console.log(interaction.customId.match(/-(.*)-/), Number(interaction.customId.match(/-(.*)-/)));

    const countBlook = (rarity) => `${emojis[rarity]}\` ${Object.keys(user.blooks).filter(a => blookList[a].rarity === rarity).length}/${Object.values(blookList).filter(a => a.rarity === rarity).length} \``;

    const finalEmbed = new discord.EmbedBuilder()
        .setTitle(`${user.username}'s Blook Collection`)
        .addFields({
            name: '__` Trade Value `__',
            value: `\`  ${tradeValue.toLocaleString()}  \` ${emojis.Token}`,
            inline: true
        }, {
            name: '__` Unique Blooks `__',
            value: `\`    ${Object.keys(user.blooks).length}/${Object.keys(blookList).length}    \``,
            inline: true
        }, {
            name: '__` Sell Value `__',
            value: `\`   ${sellValue.toLocaleString()}  \` ${emojis.Token}`,
            inline: true
        }, {
            name: 'Blook Counts',
            value: `${countBlook('Uncommon')} ${countBlook('Rare')} ${countBlook('Epic')} ${countBlook('Legendary')} ${countBlook('Chroma')} ${countBlook('Mystical')}`
        })
        .addFields(Object.entries(chunks[Number(interaction.customId.match(/-(.*)-/)[2])]).map(c => createField(c)));

    let actionRow = new discord.ActionRowBuilder();

    for (let b = 0; b < Math.ceil(Object.keys(packData).length / 6); b++) {
        actionRow.addComponents(
            new discord.ButtonBuilder()
                .setCustomId(`user-${user.id}-${b}`)
                .setLabel(`Page ${b + 1}`)
                .setStyle(b === Number(interaction.customId.match(/-(.*)-/)[2]) ? discord.ButtonStyle.Primary : discord.ButtonStyle.Secondary)
        );
    };

    await interaction.editReply({
        embeds: [finalEmbed],
        components: [actionRow]
    });
    return;
}
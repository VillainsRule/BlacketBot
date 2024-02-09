import * as discord from 'discord.js';
import axios from 'axios';

import emojis from '../data/emojis.js';

export default {
    deploy: new discord.SlashCommandBuilder()
        .setName(`user`)
        .setDescription(`Get information on a Blacket player.`)
        .addSubcommand(s => s.setName('stats').setDescription('Get a Blacket player\'s stats.')
            .addStringOption(o => o.setName('username').setDescription('Your target.').setRequired(true)))
        .addSubcommand(s => s.setName('blooks').setDescription('Get a Blacket Player\'s Blooks.')
            .addStringOption(o => o.setName('username').setDescription('Your target.').setRequired(true))),

    async run(interaction, client, blacket) {
        let user = await blacket.user(interaction.options.getString('username'));

        if (user.error) return await interaction.editReply({
            embeds: [
                new discord.EmbedBuilder()
                    .setDescription(`${emojis.Error} **Error: ${user.reason}**`)
                    .setColor(`#ff0000`)
            ],
            ephemeral: true
        });

        user = user.user;

        if (interaction.options.getSubcommand() === 'stats') {
            let origexp = user.exp
            user.level = 0;
            for (let i = 0; i <= 27915; i++) {
                user.needed = 5 * Math.pow(user.level, 0.75) * user.level;
                if (user.exp >= user.needed) {
                    user.exp -= user.needed;
                    user.level++;
                };
            };

            let total = 0;
            Object.values(user.blooks).forEach(a => total = total + a);

            let badges = {
                '12 Month Veteran': '<:12MonthVeteranBadge:1145210329740083200>',
                '18 Month Veteran': '<:18MonthVeteranBadge:1145210494462988408>',
                '24 Month Veteran': '<:24MonthVeteranBadge:1145210325772288010>',
                '6 Month Veteran': '<:6MonthVeteranBadge:1145210496199446539>',
                'Legacy Ankh': '<:legacyAnkhBadge:1145210761774387250>',
                'Artist': '<:artistBadge:1145210574108631171>',
                'Big Spender': '<:bigSpenderBadge:1145210680052568097>',
                'Blacktuber': '<:blacktuberBadge:1145210575002026145>',
                'Booster': '<:boosterBadge:1145210677942816821>',
                'OG': '<:ogBadge:1145210878812246026>',
                'Owner': '<:ownerBadge:1145210875783954483>',
                'Plus': '<:plusBadge:1145210308097491085>',
                'Staff': '<:staffBadge:1145210305375383612>',
                'Tester': '<:testerBadge:1145210303525683320>',
                'Verified': '<:verifiedBadge:1145210300392546364>',
                'Verified Bot': '<:verifiedBotBadge:1145210299222327356>'
            };

            badges['*'] = Object.keys(badges).join(' ');

            let badgeString = '';
            user.badges.forEach(badge => badgeString = badgeString + badges[badge] + ' ')
            if (badgeString === '') badgeString = 'None';

            await interaction.editReply({
                content: '',
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle(`${interaction.options.getString('username')} (ID: ${user.id})`)
                        .setURL('https://blacket.org/stats?name=' + interaction.options.getString('username'))
                        .setThumbnail('https://blacket.org' + user.avatar.split(' ').join('%20'))
                        .setColor(user.color === 'rainbow' ? 'Random' : user.color)
                        .setDescription(`**Account Created **<t:${user.created}:R>\n**Role:** ${user.role}`)
                        .setTimestamp()
                        .addFields({
                            name: 'Tokens',
                            value: `${user.tokens.toLocaleString()} ${emojis.Token}`,
                            inline: true
                        }, {
                            name: 'Level',
                            value: `${user.level.toLocaleString()} ${emojis.Level}`,
                            inline: true
                        }, {
                            name: 'EXP',
                            value: `${origexp.toLocaleString()} ${emojis.EXP}`,
                            inline: true
                        }, {
                            name: 'Packs Opened',
                            value: `${user.misc.opened.toLocaleString()} <:openedIcon:1145210877222600725>`,
                            inline: true
                        }, {
                            name: 'Unique Blooks',
                            value: `${Object.keys(user.blooks).length.toLocaleString()} <:unlock:1055529448511909948>`,
                            inline: true
                        }, {
                            name: 'Total Blooks',
                            value: `${total.toLocaleString()} <:unlock:1055529448511909948>`,
                            inline: true
                        }, {
                            name: 'Messages',
                            value: `${user.misc.messages.toLocaleString()} <:messageIcon:1145210882855546970>`,
                            inline: true
                        }, {
                            name: 'Badges',
                            value: badgeString.split(' ').slice(0, 5).join(' '),
                            inline: true
                        }, {
                            name: '​',
                            value: badgeString.split(' ').splice(5, 100).join(' ') || '​',
                            inline: true
                        })
                ]
            })
        } else {
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
                .addFields(Object.entries(chunks[0]).map(c => createField(c)));

            let actionRow = new discord.ActionRowBuilder();

            for (let b = 0; b < Math.ceil(Object.keys(packData).length / 6); b++) {
                actionRow.addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId(`user-${user.id}-${b}`)
                        .setLabel(`Page ${b + 1}`)
                        .setStyle(b === 0 ? discord.ButtonStyle.Primary : discord.ButtonStyle.Secondary)
                );
            };

            await interaction.editReply({
                embeds: [finalEmbed],
                components: [actionRow]
            });
            return;
        }
    }
}
import * as discord from 'discord.js';
import emojis from '../data/emojis.js';

export default {
    deploy: new discord.SlashCommandBuilder()
        .setName(`clan`)
        .setDescription(`Get information on a Blacket clan.`)
        .addSubcommand(s => s
            .setName('discovery')
            .setDescription('Get the clans on Discovery.')
            .addIntegerOption(o => o.setName('page').setDescription('The page number to search.').setMaxValue(20).setRequired(true)))
        .addSubcommand(s => s
            .setName('search')
            .setDescription('Search for a clan.')
            .addStringOption(o => o.setName('keyword').setDescription('What keyword are you searching for?').setRequired(true)))
        .addSubcommand(s => s
            .setName('info')
            .setDescription('Get information on a clan.')
            .addStringOption(o => o.setName('clan').setDescription('What clan are you searching for?').setRequired(true)))
        .addSubcommand(s => s
            .setName('members')
            .setDescription('Check the members of a clan.')
            .addStringOption(o => o.setName('clan').setDescription('What clan are you searching for?').setRequired(true))),

    async run(interaction, client, blacket) {
        if (interaction.options.getSubcommand() === 'discovery') {
            let clans = (await blacket.clans.discovery.page(interaction.options.getInteger('page'))).clans;

            clans.forEach(clan => {
                clan.level = 0;
                clan.originalEXP = clan.exp;
                let needed;
                for (let i = 0; i <= 27915; i++) {
                    needed = 5 * Math.pow(clan.level, 0.75) * clan.level;
                    if (clan.exp >= needed) {
                        clan.exp -= needed;
                        clan.level++;
                    }
                }
            });

            let fields = clans.map((clan) => {
                return {
                    name: `**${clan.name}**${emojis.Blank}`,
                    value: `${emojis.Online} **${clan.online}** | ${emojis.Offline} **${clan.offline}**\n${clan.safe ? ':lock:' : ':unlock:'} | ${emojis.Level} **${clan.level}**${emojis.Blank}${emojis.Blank}`,
                    inline: true
                };
            });

            await interaction.editReply({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle('Clan Discovery | Page ' + interaction.options.getInteger('page').toString())
                        .addFields(fields)
                ]
            })
        } else if (interaction.options.getSubcommand() === 'search') {
            let clans = await blacket.clans.discovery.search(interaction.options.getString('keyword'));

            if (!clans.clans.length) return await interaction.editReply({
                embeds: [
                    new discord.EmbedBuilder()
                        .setDescription(`${emojis.Error} **There are no clans matching that keyword.**`)
                        .setColor(`#ff0000`)
                ],
                ephemeral: true
            });

            clans.clans.forEach(clan => {
                clan.level = 0;
                clan.originalEXP = clan.exp;
                let needed;
                for (let i = 0; i <= 27915; i++) {
                    needed = 5 * Math.pow(clan.level, 0.75) * clan.level;
                    if (clan.exp >= needed) {
                        clan.exp -= needed;
                        clan.level++;
                    }
                }
            });

            let fields = clans.clans.map((clan) => {
                return {
                    name: `**${clan.name}**${emojis.Blank}`,
                    value: `${emojis.Online} **${clan.online}** | ${emojis.Offline} **${clan.offline}**\n${clan.safe ? ':lock:' : ':unlock:'} | ${emojis.Level} **${clan.level}**${emojis.Blank}${emojis.Blank}`,
                    inline: true
                };
            });

            await interaction.editReply({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle('Clan Discovery | Search Results')
                        .setDescription(`> Query: **${interaction.options.getString('keyword')}**`)
                        .addFields(fields)
                ]
            })
        } else if (interaction.options.getSubcommand() === 'info') {
            let clans = await blacket.clans.discovery.search(interaction.options.getString('clan'));
            let clan = clans.clans.filter(clan => clan.name.toLowerCase() === interaction.options.getString('clan').toLowerCase())?.[0];

            if (!clan) return await interaction.editReply({
                embeds: [
                    new discord.EmbedBuilder()
                        .setDescription(`${emojis.Error} **Clan not found. Are you spelling it correcty?**`)
                        .setColor(`#ff0000`)
                ],
                ephemeral: true
            });

            clan.level = 0;
            clan.originalEXP = clan.exp;
            let needed;
            for (let i = 0; i <= 27915; i++) {
                needed = 5 * Math.pow(clan.level, 0.75) * clan.level;
                if (clan.exp >= needed) {
                    clan.exp -= needed;
                    clan.level++;
                }
            }

            let parseAvatar = (av) => av.startsWith('/content/blooks') ? emojis[av.split('/')[3].split('.')[0]] ? emojis[av.split('/')[3].split('.')[0]] : emojis.Blank : emojis.Blank;

            console.log(clan);

            await interaction.editReply({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle(`Clan: ${clan.name}`)
                        .setDescription(`> ${clan.description}`)
                        .setColor('#ffffff')
                        .setImage(clan.image)
                        .addFields({
                            name: 'Created',
                            value: `${emojis['Analog Clock']} **<t:${clan.created}:R>**`,
                            inline: true
                        }, {
                            name: 'Level',
                            value: `${emojis['Level']} **${clan.level}**`,
                            inline: true
                        }, {
                            name: 'Safe',
                            value: `${clan.safe ? ':lock:' : ':unlock:'} **${clan.safe ? 'Yes' : 'No'}**`,
                            inline: true
                        }, {
                            name: 'Online:',
                            value: `${emojis.Online} **${clan.online}** | ${emojis.Offline} **${clan.offline}**`,
                            inline: true
                        }, {
                            name: 'Owner',
                            value: `${parseAvatar(clan.owner.avatar)} ${clan.owner.username}`,
                            inline: true
                        }, {
                            name: 'Members',
                            value: `${emojis.Users} \`/clan members\``,
                            inline: true
                        })
                ]
            })

        } else if (interaction.options.getSubcommand() === 'members') {
            let clans = await blacket.clans.discovery.search(interaction.options.getString('clan'));
            let clan = clans.clans.filter(clan => clan.name.toLowerCase() === interaction.options.getString('clan').toLowerCase())?.[0];

            if (!clan) return await interaction.editReply({
                embeds: [
                    new discord.EmbedBuilder()
                        .setDescription(`${emojis.Error} **Clan not found. Are you spelling it correcty?**`)
                        .setColor(`#ff0000`)
                ],
                ephemeral: true
            });

            let parseAvatar = (av) => av.startsWith('/content/blooks') ? emojis[av.split('/')[3].split('.')[0]] ? emojis[av.split('/')[3].split('.')[0]] : emojis.Blank : emojis.Blank;

            let fields = clan.members.filter(member => member.id !== clan.owner.id).map((m) => {
                return {
                    name: `${parseAvatar(m.avatar)} **${m.username}**${emojis.Blank}`,
                    value: `ID: \`${m.id}\``,
                    inline: true
                };
            });

            interaction.editReply({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle(`${clan.name} | Members`)
                        .setDescription(`**Owner**: ${parseAvatar(clan.owner.avatar)} ${clan.owner.username}\n**Members**:`)
                        .addFields(fields)
                ]
            })
        }
    }
}
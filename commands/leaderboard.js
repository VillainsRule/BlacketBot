import * as discord from 'discord.js';
import emojis from '../data/emojis.js';

export default {
    deploy: new discord.SlashCommandBuilder()
        .setName(`leaderboard`)
        .setDescription(`The Blacket Leaderboards.`)
        .addSubcommand(subcommand => subcommand.setName('tokens').setDescription('Get the token leaderboard.'))
        .addSubcommand(subcommand => subcommand.setName('levels').setDescription('Get the level leaderboard.')),

    async run(interaction, client, blacket) {
        let leaderboard = await blacket.leaderboard();

        if (interaction.options.getSubcommand() === 'tokens') {
            let lb = leaderboard.tokens;

            interaction.editReply({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle(`Token Leaderboard`)
                        .setDescription(lb.map(a => a = `${emojis['Trophy' + (lb.indexOf(a) + 1)] || emojis.Arrow} **${a.username}** - ${a.tokens.toLocaleString()} ${emojis.Token}`).join('\n'))
                        .setTimestamp()
                        .setThumbnail('https://blacket.org/content/tokenIcon.png')
                ]
            })
        } else {
            let lb = leaderboard.exp;

            interaction.editReply({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle(`Level Leaderboard`)
                        .setDescription(lb.map(a => a = `${emojis['Trophy' + (lb.indexOf(a) + 1)] || emojis.Arrow} **${a.username}** - ${a.level.toLocaleString()} ${emojis.Level}`).join('\n'))
                        .setTimestamp()
                        .setThumbnail('https://blacket.org/content/levelStar.png')
                ]
            })
        }
    }
}